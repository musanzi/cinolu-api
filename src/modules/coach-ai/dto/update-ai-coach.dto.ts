import { PartialType } from '@nestjs/mapped-types';
import { CreateAiCoachDto } from './create-ai-coach.dto';

export class UpdateAiCoachDto extends PartialType(CreateAiCoachDto) {}
