import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}
