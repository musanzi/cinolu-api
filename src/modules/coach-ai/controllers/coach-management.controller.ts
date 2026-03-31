import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Rbac } from '@musanzi/nestjs-session-auth';
import { CreateAiCoachDto } from '../dto/create-ai-coach.dto';
import { UpdateAiCoachDto } from '../dto/update-ai-coach.dto';
import { AiCoach } from '../entities/ai-coach.entity';
import { CoachManagementService } from '../services/coach-management.service';

@Controller('coach-ai')
export class CoachManagementController {
  constructor(private readonly coachManagementService: CoachManagementService) {}

  @Post()
  @Rbac({ resource: 'coachAi', action: 'create' })
  create(@Body() dto: CreateAiCoachDto): Promise<AiCoach> {
    return this.coachManagementService.create(dto);
  }

  @Get()
  @Rbac({ resource: 'coachAi', action: 'read' })
  findAll(): Promise<AiCoach[]> {
    return this.coachManagementService.findAll();
  }

  @Get('id/:id')
  @Rbac({ resource: 'coachAi', action: 'read' })
  findOne(@Param('id') id: string): Promise<AiCoach> {
    return this.coachManagementService.findOne(id);
  }

  @Patch('id/:id')
  @Rbac({ resource: 'coachAi', action: 'update' })
  update(@Param('id') id: string, @Body() dto: UpdateAiCoachDto): Promise<AiCoach> {
    return this.coachManagementService.update(id, dto);
  }

  @Delete('id/:id')
  @Rbac({ resource: 'coachAi', action: 'delete' })
  remove(@Param('id') id: string): Promise<void> {
    return this.coachManagementService.remove(id);
  }
}
