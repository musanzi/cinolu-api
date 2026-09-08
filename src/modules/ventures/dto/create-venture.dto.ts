import { ArrayUnique, IsArray, IsEnum, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { VentureSocials, VentureStage } from '../interfaces';

export class CreateVentureDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  socials?: VentureSocials;

  @IsEnum(VentureStage)
  stage: VentureStage;

  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  sectorIds: string[];
}
