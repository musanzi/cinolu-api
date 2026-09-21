import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 1 })
  @IsNotEmpty()
  password: string;
}
