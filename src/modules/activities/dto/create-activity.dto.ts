import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsDate, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { FormResponses } from '../interfaces';

export class CreateActivityDto {
  @IsUUID()
  programId: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  typeId: string;

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsObject()
  participationForm: FormResponses;

  @IsObject()
  reviewForm: FormResponses;
}
