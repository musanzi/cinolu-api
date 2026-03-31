import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CoachAiService } from '@/modules/coach-ai/services/coach-ai.service';

describe('CoachAiService', () => {
  const setup = () => {
    const venturesService = {
      findOne: jest.fn()
    } as any;
    const coachManagementService = {
      findAllActive: jest.fn(),
      findByIdOrFail: jest.fn()
    } as any;
    const conversationsService = {
      findByCoachAndVenture: jest.fn(),
      findByCoachAndVentureOrFail: jest.fn(),
      create: jest.fn()
    } as any;
    const messagesService = {
      findByConversation: jest.fn(),
      createUserMessage: jest.fn(),
      createCoachMessage: jest.fn()
    } as any;
    const conversationWorkflow = {
      run: jest.fn()
    } as any;

    const service = new CoachAiService(
      venturesService,
      coachManagementService,
      conversationsService,
      messagesService,
      conversationWorkflow
    );

    return {
      service,
      venturesService,
      coachManagementService,
      conversationsService,
      messagesService,
      conversationWorkflow
    };
  };

  it('lists coaches for the venture owner', async () => {
    const { service, venturesService, coachManagementService } = setup();
    venturesService.findOne.mockResolvedValue({ id: 'v1', owner: { id: 'u1' } });
    coachManagementService.findAllActive.mockResolvedValue([{ id: 'c1' }, { id: 'c2' }]);

    await expect(service.findCoachesForVenture('v1', { id: 'u1' } as any)).resolves.toEqual([{ id: 'c1' }, { id: 'c2' }]);
  });

  it('loads the selected coach conversation for the venture owner', async () => {
    const { service, venturesService, coachManagementService, conversationsService } = setup();
    venturesService.findOne.mockResolvedValue({ id: 'v1', owner: { id: 'u1' } });
    coachManagementService.findByIdOrFail.mockResolvedValue({ id: 'c1' });
    conversationsService.findByCoachAndVentureOrFail.mockResolvedValue({ id: 'conv1' });

    await expect(service.findConversation('v1', 'c1', { id: 'u1' } as any)).resolves.toEqual({ id: 'conv1' });
  });

  it('saves user and coach messages during chat with the selected coach', async () => {
    const { service, venturesService, coachManagementService, conversationsService, messagesService, conversationWorkflow } =
      setup();
    venturesService.findOne.mockResolvedValue({ id: 'v1', owner: { id: 'u1' }, name: 'AgriNova' });
    coachManagementService.findByIdOrFail.mockResolvedValue({
      id: 'c1',
      expected_outputs: ['CLARIFICATION']
    });
    conversationsService.findByCoachAndVenture.mockResolvedValue({ id: 'conv1' });
    messagesService.findByConversation.mockResolvedValue([{ role: 'assistant', content: 'old' }]);
    messagesService.createUserMessage.mockResolvedValue(undefined);
    messagesService.createCoachMessage.mockResolvedValue(undefined);
    conversationWorkflow.run.mockResolvedValue({
      type: 'CLARIFICATION',
      title: 'Clarification',
      summary: 'Precise la traction de AgriNova',
      bullets: ['Indique le nombre de clients.'],
      ventureFocus: 'AgriNova',
      scopeCheck: { profile: 'Coach', role: 'Diagnostic', grounded: true }
    });

    await expect(service.chat('v1', 'c1', { id: 'u1' } as any, { message: 'Que faire ?' })).resolves.toEqual(
      expect.objectContaining({ type: 'CLARIFICATION' })
    );
    expect(messagesService.createUserMessage).toHaveBeenCalledWith('conv1', 'Que faire ?');
    expect(messagesService.createCoachMessage).toHaveBeenCalledWith(
      'conv1',
      expect.objectContaining({ type: 'CLARIFICATION' })
    );
  });

  it('rejects chat when the user does not own the venture', async () => {
    const { service, venturesService } = setup();
    venturesService.findOne.mockResolvedValue({ id: 'v1', owner: { id: 'u2' } });

    await expect(service.chat('v1', 'c1', { id: 'u1' } as any, { message: 'Que faire ?' })).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('throws when the selected coach is missing', async () => {
    const { service, venturesService, coachManagementService } = setup();
    venturesService.findOne.mockResolvedValue({ id: 'v1', owner: { id: 'u1' } });
    coachManagementService.findByIdOrFail.mockRejectedValue(new NotFoundException('Coach introuvable'));

    await expect(service.findCoachForVenture('v1', 'c1', { id: 'u1' } as any)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});
