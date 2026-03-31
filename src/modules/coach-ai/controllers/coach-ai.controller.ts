import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '@musanzi/nestjs-session-auth';
import { User } from '@/modules/users/entities/user.entity';
import { CreateCoachMessageDto } from '../dto/create-coach-message.dto';
import { CoachAiService } from '../services/coach-ai.service';
import { AiCoach } from '../entities/ai-coach.entity';
import { CoachConversation } from '../entities/coach-conversation.entity';
import { CoachOutput } from '../types/coach-output.type';
import { Rbac } from '@musanzi/nestjs-session-auth';

@Controller('ventures/:ventureId/coaches')
export class CoachAiController {
  constructor(private readonly coachAiService: CoachAiService) {}

  @Get()
  @Rbac({ resource: 'ventureCoaches', action: 'read' })
  findCoaches(@Param('ventureId') ventureId: string, @CurrentUser() user: User): Promise<AiCoach[]> {
    return this.coachAiService.findCoachesForVenture(ventureId, user);
  }

  @Get(':coachId')
  @Rbac({ resource: 'ventureCoaches', action: 'read' })
  findCoach(
    @Param('ventureId') ventureId: string,
    @Param('coachId') coachId: string,
    @CurrentUser() user: User
  ): Promise<AiCoach> {
    return this.coachAiService.findCoachForVenture(ventureId, coachId, user);
  }

  @Get(':coachId/conversation')
  @Rbac({ resource: 'ventureCoaches', action: 'read' })
  findConversation(
    @Param('ventureId') ventureId: string,
    @Param('coachId') coachId: string,
    @CurrentUser() user: User
  ): Promise<CoachConversation> {
    return this.coachAiService.findConversation(ventureId, coachId, user);
  }

  @Post(':coachId/messages')
  @Rbac({ resource: 'ventureCoaches', action: 'read' })
  chat(
    @Param('ventureId') ventureId: string,
    @Param('coachId') coachId: string,
    @CurrentUser() user: User,
    @Body() dto: CreateCoachMessageDto
  ): Promise<CoachOutput> {
    return this.coachAiService.chat(ventureId, coachId, user, dto);
  }
}
