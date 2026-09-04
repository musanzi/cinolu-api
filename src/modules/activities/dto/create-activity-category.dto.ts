import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateActivityCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
