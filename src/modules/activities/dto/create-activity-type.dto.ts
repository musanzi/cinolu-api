import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateActivityTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
