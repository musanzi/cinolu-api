import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { EventHandlers } from './events/handlers';
import { SessionSerializer } from './serializers/session.serializer';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Role]), PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [LocalStrategy, GoogleStrategy, SessionSerializer, ...CommandHandlers, ...QueryHandlers, ...EventHandlers]
})
export class AuthModule {}
