import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CoachManagementService } from '@/modules/coach-ai/services/coach-management.service';

describe('CoachManagementService', () => {
  const setup = () => {
    const coachRepository = {
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      softDelete: jest.fn()
    } as any;
    const service = new CoachManagementService(coachRepository);
    return { service, coachRepository };
  };

  it('creates a managed coach', async () => {
    const { service, coachRepository } = setup();
    coachRepository.save.mockResolvedValue({ id: 'c1' });

    await expect(
      service.create({
        name: 'Coach finance',
        profile: 'Profil',
        role: 'Role',
        expected_outputs: ['RISKS']
      } as any)
    ).resolves.toEqual({ id: 'c1' });
  });

  it('lists all coaches', async () => {
    const { service, coachRepository } = setup();
    coachRepository.find.mockResolvedValue([{ id: 'c1' }]);

    await expect(service.findAll()).resolves.toEqual([{ id: 'c1' }]);
  });

  it('lists active coaches', async () => {
    const { service, coachRepository } = setup();
    coachRepository.find.mockResolvedValue([{ id: 'c1', status: 'active' }]);

    await expect(service.findAllActive()).resolves.toEqual([{ id: 'c1', status: 'active' }]);
  });

  it('updates a coach', async () => {
    const { service, coachRepository } = setup();
    coachRepository.findOneOrFail.mockResolvedValue({ id: 'c1' });
    coachRepository.merge.mockImplementation((target: any, payload: any) => Object.assign(target, payload));
    coachRepository.save.mockResolvedValue({ id: 'c1', status: 'inactive' });

    await expect(service.update('c1', { status: 'inactive' } as any)).resolves.toEqual({ id: 'c1', status: 'inactive' });
  });

  it('throws when coach creation fails', async () => {
    const { service, coachRepository } = setup();
    coachRepository.save.mockRejectedValue(new Error('bad'));

    await expect(
      service.create({
        name: 'Coach',
        profile: 'Profil',
        role: 'Role',
        expected_outputs: ['DIAGNOSTIC']
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws when coach deletion fails', async () => {
    const { service, coachRepository } = setup();
    coachRepository.findOneOrFail.mockResolvedValue({ id: 'c1' });
    coachRepository.softDelete.mockRejectedValue(new Error('bad'));

    await expect(service.remove('c1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
