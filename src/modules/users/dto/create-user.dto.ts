import { IsArray, IsEmail, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserSocialLinks } from '../interfaces';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: UserSocialLinks;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roles?: string[];
}
