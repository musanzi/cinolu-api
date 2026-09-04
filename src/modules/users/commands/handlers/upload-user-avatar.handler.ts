import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { promises } from 'fs';
import { IUserResponse } from '../../interfaces';
import { UploadUserAvatar } from '../impl';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserById } from '../../queries';

@CommandHandler(UploadUserAvatar)
export class UploadUserAvatarHandler implements ICommandHandler<UploadUserAvatar, IUserResponse> {
  private readonly logger = new Logger(UploadUserAvatarHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UploadUserAvatar): Promise<IUserResponse> {
    const { userId, file } = command;

    try {
      const user = await this.queryBus.execute(new FindUserById(userId));

      if (user.avatar) {
        await promises.rm(`./uploads/profiles/${user.avatar}`, { force: true });
      }

      await this.repository.update(user.id, { avatar: file.filename });

      return await this.queryBus.execute(new FindUserById(user.id));
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(
        `Upload user avatar failed id="${userId}": ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException("Ajout d'image impossible");
    }
  }
}
