import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags
} from '@nestjs/swagger';
import { AbstractController } from '@/shared/abstracts';
import { User } from '../../users/entities/user.entity';
import { IUserResponse } from '../../users/interfaces';
import { UpdateUserDto, UserResponseDto } from '../../users/dto';
import { ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto, UpdatePasswordDto } from '../dto';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ForgotPassword, ResetPassword, SignOut, SignUp, UpdatePassword, UpdateProfile } from '../commands';
import { GoogleRedirect, GetProfile, SignIn } from '../queries';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends AbstractController {
  @Post('signup')
  @Public()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ description: 'Account created and session established', type: UserResponseDto })
  signUp(@Body() dto: SignUpDto): Promise<IUserResponse> {
    return this.commandHandler.execute(new SignUp(dto));
  }

  @Post('signin')
  @Public()
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'Signed in and session established', type: UserResponseDto })
  @UseGuards(LocalAuthGuard)
  signIn(@Req() req: Request): Promise<IUserResponse> {
    return this.queryHandler.execute(new SignIn(req));
  }

  @Get('signin/google')
  @Public()
  @ApiOperation({ summary: 'Start Google OAuth sign-in (redirects to Google)' })
  @ApiFoundResponse({ description: 'Redirected to Google consent screen' })
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {}

  @Get('google/redirect')
  @Public()
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiFoundResponse({ description: 'Redirected to the frontend after authentication' })
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.queryHandler.execute(new GoogleRedirect(res, req.query.state));
  }

  @Post('signout')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Sign out the current session' })
  @ApiNoContentResponse({ description: 'Signed out' })
  signOut(@Req() req: Request): Promise<void> {
    return this.commandHandler.execute(new SignOut(req));
  }

  @Get('me')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiOkResponse({ description: 'Current user profile', type: UserResponseDto })
  profile(@CurrentUser() user: User): Promise<IUserResponse> {
    return this.queryHandler.execute(new GetProfile(user.email));
  }

  @Patch('me/update')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiOkResponse({ description: 'Updated user profile', type: UserResponseDto })
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateUserDto): Promise<IUserResponse> {
    return this.commandHandler.execute(new UpdateProfile(user, dto));
  }

  @Patch('password/update')
  @ApiSecurity('session')
  @ApiOperation({ summary: 'Update the current user password' })
  @ApiOkResponse({ description: 'Updated user profile', type: UserResponseDto })
  updatePassword(@CurrentUser() user: User, @Body() dto: UpdatePasswordDto): Promise<IUserResponse> {
    return this.commandHandler.execute(new UpdatePassword(user, dto));
  }

  @Post('password/forgot')
  @Public()
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiNoContentResponse({ description: 'Reset email sent if the account exists' })
  forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    return this.commandHandler.execute(new ForgotPassword(dto));
  }

  @Post('password/reset')
  @Public()
  @ApiOperation({ summary: 'Reset password with the token from the reset email' })
  @ApiOkResponse({ description: 'Password reset and session established', type: UserResponseDto })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<IUserResponse> {
    return this.commandHandler.execute(new ResetPassword(dto));
  }
}
