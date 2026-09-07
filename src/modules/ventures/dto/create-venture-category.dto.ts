import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVentureCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
