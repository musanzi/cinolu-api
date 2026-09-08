import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength
} from 'class-validator';
import { ActivityForm } from '../interfaces';

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

  @IsObject()
  participationForm: ActivityForm;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsObject()
  reviewForm: ActivityForm;

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  mentorIds: string[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  typeIds: string[];

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
