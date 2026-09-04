import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  logo?: string;
}
