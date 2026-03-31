import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/modules/users/entities/user.entity';
import { Venture } from '@/modules/ventures/entities/venture.entity';
import { VenturesService } from '@/modules/ventures/services/ventures.service';
import { CreateCoachMessageDto } from '../dto/create-coach-message.dto';
import { AiCoach } from '../entities/ai-coach.entity';
import { CoachConversation } from '../entities/coach-conversation.entity';
import { CoachConversationWorkflowService } from './coach-conversation-workflow.service';
import { CoachOutput } from '../types/coach-output.type';
import { CoachConversationsService } from './coach-conversations.service';
import { CoachMessagesService } from './coach-messages.service';
import { CoachManagementService } from './coach-management.service';

@Injectable()
export class CoachAiService {
  constructor(
    private readonly venturesService: VenturesService,
    private readonly coachManagementService: CoachManagementService,
    private readonly conversationsService: CoachConversationsService,
    private readonly messagesService: CoachMessagesService,
    private readonly conversationWorkflow: CoachConversationWorkflowService
  ) {}

  async findCoachesForVenture(ventureId: string, user: User): Promise<AiCoach[]> {
    try {
      await this.ensureOwner(ventureId, user.id);
      return await this.coachManagementService.findAllActive();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new NotFoundException('Coachs introuvables');
    }
  }

  async findCoachForVenture(ventureId: string, coachId: string, user: User): Promise<AiCoach> {
    try {
      await this.ensureOwner(ventureId, user.id);
      return await this.findCoachEntity(coachId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new NotFoundException('Coach introuvable');
    }
  }

  async findConversation(ventureId: string, coachId: string, user: User): Promise<CoachConversation> {
    try {
      const venture = await this.ensureOwner(ventureId, user.id);
      const coach = await this.findCoachEntity(coachId);
      return await this.findConversationEntity(coach.id, venture.id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new NotFoundException('Conversation introuvable');
    }
  }

  async chat(ventureId: string, coachId: string, user: User, dto: CreateCoachMessageDto): Promise<CoachOutput> {
    try {
      const venture = await this.ensureOwner(ventureId, user.id);
      const coach = await this.findCoachEntity(coachId);
      const conversation = await this.findOrCreateConversation(coach, venture);
      const history = await this.messagesService.findByConversation(conversation.id);
      await this.messagesService.createUserMessage(conversation.id, dto.message);
      const output = await this.conversationWorkflow.run(coach, venture, dto.message, history);
      await this.messagesService.createCoachMessage(conversation.id, output);
      return output;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Message impossible');
    }
  }

  private async ensureOwner(ventureId: string, userId: string): Promise<Venture> {
    try {
      const venture = await this.venturesService.findOne(ventureId);
      if (venture.owner?.id !== userId) {
        throw new BadRequestException('Accès au coach refusé');
      }
      return venture;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new NotFoundException('Venture introuvable');
    }
  }

  private async findCoachEntity(coachId: string): Promise<AiCoach> {
    return await this.coachManagementService.findByIdOrFail(coachId);
  }

  private async findConversationEntity(coachId: string, ventureId: string): Promise<CoachConversation> {
    return await this.conversationsService.findByCoachAndVentureOrFail(coachId, ventureId);
  }

  private async findOrCreateConversation(coach: AiCoach, venture: Venture): Promise<CoachConversation> {
    const existingConversation = await this.conversationsService.findByCoachAndVenture(coach.id, venture.id);
    if (existingConversation) return existingConversation;
    return await this.conversationsService.create(coach.id, venture.id);
  }
}
