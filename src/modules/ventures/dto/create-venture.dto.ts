import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';
import { VentureLinks } from '../interfaces';

export class CreateVentureDto {
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
