import { MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'newSecret123', minLength: 6 })
  @MinLength(6)
  password: string;
}
