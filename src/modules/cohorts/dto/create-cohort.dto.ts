import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCohortDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsUUID('4')
  programId: string;
}
