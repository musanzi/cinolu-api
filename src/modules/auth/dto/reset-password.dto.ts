import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token received by email' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newSecret123', minLength: 6 })
  @MinLength(6)
  password: string;
}
