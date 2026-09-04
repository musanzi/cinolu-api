import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { UserSubscriber } from './subscribers';
import { Role } from '../roles/entities/role.entity';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { EventHandlers } from './events/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule],
  controllers: [UsersController],
  providers: [UserSubscriber, ...CommandHandlers, ...QueryHandlers, ...EventHandlers]
})
export class UsersModule {}
