import { BadRequestException } from '@nestjs/common';
import { ParticipationReviewsService } from '@/modules/projects/services/participation-reviews.service';
import { ProjectParticipationStatus } from '@/modules/projects/types/project-participation-status.enum';

const makeQueryBuilder = (result: [any[], number] = [[], 0], entity: any = { id: 'pp1' }) => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  loadRelationCountAndMap: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  distinct: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue(result),
  getOneOrFail: jest.fn().mockResolvedValue(entity)
});

describe('ParticipationReviewsService', () => {
  const setup = () => {
    const queryBuilder = makeQueryBuilder([[{ id: 'pp1' }], 1], {
      id: 'pp1',
      status: ProjectParticipationStatus.QUALIFIED,
      review_message: 'Documents recus',
      user: { id: 'participant-1', email: 'participant@example.com', name: 'Participant' },
      project: { id: 'project-1', name: 'Project 1' },
      phases: [{ id: 'phase-1' }, { id: 'phase-2' }]
    });
    const participationRepository = {
      find: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder)
    } as any;
    const participationService = {
      findOne: jest.fn()
    } as any;
    const notificationService = { notifyReviewAction: jest.fn() } as any;

    const service = new ParticipationReviewsService(participationRepository, participationService, notificationService);
    return {
      service,
      queryBuilder,
      participationRepository,
      participationService,
      notificationService
    };
  };

  it('reviews a participation, appends next phase, and notifies participant and mentors', async () => {
    const { service, participationRepository, participationService, notificationService } = setup();
    participationRepository.findOneOrFail.mockResolvedValue({
      id: 'pp1',
      user: { id: 'participant-1', email: 'participant@example.com', name: 'Participant' },
      project: {
        id: 'project-1',
        name: 'Project 1',
        project_manager: { id: 'pm-1' },
        phases: [
          { id: 'phase-1', started_at: new Date('2026-01-01') },
          { id: 'phase-2', started_at: new Date('2026-02-01') }
        ]
      },
      phases: [{ id: 'phase-1', mentors: [{ owner: { id: 'mentor-1' } }] }]
    });
    participationRepository.save.mockImplementation(async (payload) => payload);
    notificationService.notifyReviewAction.mockResolvedValue(undefined);
    participationService.findOne.mockResolvedValue({
      id: 'pp1',
      status: ProjectParticipationStatus.QUALIFIED,
      review_message: 'Documents recus',
      user: { id: 'participant-1', email: 'participant@example.com', name: 'Participant' },
      project: { id: 'project-1', name: 'Project 1' },
      phases: [{ id: 'phase-1' }, { id: 'phase-2' }]
    });

    await expect(
      service.reviewParticipation('pp1', { id: 'pm-1', name: 'PM' } as any, {
        status: ProjectParticipationStatus.QUALIFIED,
        review_message: 'Documents recus'
      })
    ).resolves.toEqual(
      expect.objectContaining({
        id: 'pp1',
        status: ProjectParticipationStatus.QUALIFIED
      })
    );
    expect(participationRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ProjectParticipationStatus.QUALIFIED,
        review_message: 'Documents recus',
        reviewed_by: { id: 'pm-1' },
        phases: [
          { id: 'phase-1', mentors: [{ owner: { id: 'mentor-1' } }] },
          { id: 'phase-2', started_at: new Date('2026-02-01') }
        ]
      })
    );
    expect(notificationService.notifyReviewAction).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'pp1',
        status: ProjectParticipationStatus.QUALIFIED
      }),
      { id: 'pm-1', name: 'PM' },
      ProjectParticipationStatus.QUALIFIED
    );
  });

  it('requires a message when requesting additional information', async () => {
    const { service } = setup();
    await expect(
      service.reviewParticipation('pp1', { id: 'pm-1', name: 'PM' } as any, {
        status: ProjectParticipationStatus.INFO_REQUESTED
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects unauthorized reviewers', async () => {
    const { service, participationRepository } = setup();
    participationRepository.findOneOrFail.mockResolvedValue({
      id: 'pp1',
      user: { id: 'participant-1' },
      project: {
        id: 'project-1',
        project_manager: { id: 'pm-1' },
        phases: []
      },
      phases: [{ id: 'phase-1', mentors: [{ owner: { id: 'mentor-1' } }] }]
    });

    await expect(
      service.reviewParticipation('pp1', { id: 'outsider-1', roles: [{ name: 'user' }] } as any, {
        status: ProjectParticipationStatus.DISQUALIFIED,
        review_message: 'Non retenu'
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not append a new phase when the participation is already on the last phase', async () => {
    const { service, participationRepository, participationService, notificationService } = setup();
    participationRepository.findOneOrFail.mockResolvedValue({
      id: 'pp1',
      user: { id: 'participant-1', email: 'participant@example.com', name: 'Participant' },
      project: {
        id: 'project-1',
        name: 'Project 1',
        project_manager: { id: 'pm-1' },
        phases: [{ id: 'phase-1', started_at: new Date('2026-01-01') }]
      },
      phases: [{ id: 'phase-1', mentors: [{ owner: { id: 'mentor-1' } }] }]
    });
    participationRepository.save.mockImplementation(async (payload) => payload);
    notificationService.notifyReviewAction.mockResolvedValue(undefined);
    participationService.findOne.mockResolvedValue({
      id: 'pp1',
      status: ProjectParticipationStatus.QUALIFIED,
      user: { id: 'participant-1', email: 'participant@example.com', name: 'Participant' },
      project: { id: 'project-1', name: 'Project 1' },
      phases: [{ id: 'phase-1' }]
    });

    await expect(
      service.reviewParticipation('pp1', { id: 'pm-1', name: 'PM' } as any, {
        status: ProjectParticipationStatus.QUALIFIED,
        review_message: 'Continuez'
      })
    ).resolves.toEqual(expect.objectContaining({ id: 'pp1' }));
    expect(participationRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        phases: [{ id: 'phase-1', mentors: [{ owner: { id: 'mentor-1' } }] }]
      })
    );
    expect(notificationService.notifyReviewAction).toHaveBeenCalled();
  });
});
