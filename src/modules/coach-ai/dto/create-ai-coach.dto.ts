import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAiCoachDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  profile: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsArray()
  expected_outputs: string[];

  @IsOptional()
  @IsString()
  status?: string;
}
