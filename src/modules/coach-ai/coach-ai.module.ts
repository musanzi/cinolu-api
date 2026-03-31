import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenturesModule } from '@/modules/ventures/ventures.module';
import { AiCoach } from './entities/ai-coach.entity';
import { CoachConversation } from './entities/coach-conversation.entity';
import { CoachMessage } from './entities/coach-message.entity';
import { CoachAiController } from './controllers/coach-ai.controller';
import { CoachManagementController } from './controllers/coach-management.controller';
import { CoachAiService } from './services/coach-ai.service';
import { CoachConversationWorkflowService } from './services/coach-conversation-workflow.service';
import { CoachLlmService } from './services/coach-llm.service';
import { CoachOutputValidatorService } from './services/coach-output-validator.service';
import { CoachConversationsService } from './services/coach-conversations.service';
import { CoachMessagesService } from './services/coach-messages.service';
import { CoachManagementService } from './services/coach-management.service';
import { SessionAuthModule } from '@musanzi/nestjs-session-auth';
import { COACH_AI_RBAC_POLICY } from './coach-ai-rbac';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiCoach, CoachConversation, CoachMessage]),
    VenturesModule,
    SessionAuthModule.forFeature([COACH_AI_RBAC_POLICY])
  ],
  controllers: [CoachAiController, CoachManagementController],
  providers: [
    CoachAiService,
    CoachConversationWorkflowService,
    CoachLlmService,
    CoachOutputValidatorService,
    CoachConversationsService,
    CoachMessagesService,
    CoachManagementService
  ],
  exports: [CoachAiService, CoachManagementService]
})
export class CoachAiModule {}
