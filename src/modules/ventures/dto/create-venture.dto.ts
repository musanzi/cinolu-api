import { ArrayUnique, IsArray, IsObject, IsOptional, IsString, IsUUID, MaxLength, ValidateIf } from 'class-validator';
import { VentureLinks } from '../interfaces';

export class CreateVentureDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @IsString()
  @MaxLength(150)
  name: string;

  @IsString()
  @MaxLength(255)
  pitch: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logo?: string;

  @IsOptional()
  @IsObject()
  links?: VentureLinks;
}
