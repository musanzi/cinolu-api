import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsBoolean, IsDate, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ActivityForm, ActivityResource } from '../interfaces';

export class CreateActivityDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  participationForm: ActivityForm;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  reviewForm: ActivityForm;

  @IsOptional()
  resources?: ActivityResource[];

  @IsUUID('4')
  programId: string;

  @IsOptional()
  @IsUUID('4')
  cohortId?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  mentorIds: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  typeIds: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
