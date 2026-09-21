import { ApiProperty } from '@nestjs/swagger';
import { UserSocialLinks } from '../interfaces';

export class UserResponseDto {
  @ApiProperty({ example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email: string;

  @ApiProperty({ example: null, nullable: true })
  avatar: string | null;

  @ApiProperty({ example: 'CTO', nullable: true, required: false })
  jobTitle?: string;

  @ApiProperty({ example: 'Full-stack developer based in Berlin.' })
  biography: string;

  @ApiProperty({ type: 'object', additionalProperties: true, example: { github: 'https://github.com/janedoe' } })
  socialLinks: UserSocialLinks;

  @ApiProperty({ type: [String], example: ['user'] })
  roles: string[];

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt: Date;

  @ApiProperty({ format: 'date-time', nullable: true, example: null })
  deletedAt: Date | null;
}
