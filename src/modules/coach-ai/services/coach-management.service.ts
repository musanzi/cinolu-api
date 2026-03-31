import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAiCoachDto } from '../dto/create-ai-coach.dto';
import { UpdateAiCoachDto } from '../dto/update-ai-coach.dto';
import { AiCoach } from '../entities/ai-coach.entity';

@Injectable()
export class CoachManagementService {
  constructor(
    @InjectRepository(AiCoach)
    private readonly coachRepository: Repository<AiCoach>
  ) {}

  async findAllActive(): Promise<AiCoach[]> {
    try {
      return await this.coachRepository.find({
        where: { status: 'active' },
        order: { created_at: 'DESC' }
      });
    } catch {
      throw new BadRequestException('Coachs introuvables');
    }
  }

  async findByIdOrFail(id: string): Promise<AiCoach> {
    try {
      return await this.coachRepository.findOneOrFail({
        where: { id }
      });
    } catch {
      throw new NotFoundException('Coach introuvable');
    }
  }

  async create(dto: CreateAiCoachDto): Promise<AiCoach> {
    try {
      return await this.coachRepository.save({
        name: dto.name,
        profile: dto.profile,
        role: dto.role,
        expected_outputs: dto.expected_outputs,
        status: dto.status || 'active',
        model: 'llama3.2:3b'
      });
    } catch {
      throw new BadRequestException('Création du coach impossible');
    }
  }

  async findAll(): Promise<AiCoach[]> {
    try {
      return await this.coachRepository.find({
        order: { created_at: 'DESC' }
      });
    } catch {
      throw new BadRequestException('Coachs introuvables');
    }
  }

  async findOne(id: string): Promise<AiCoach> {
    return await this.findByIdOrFail(id);
  }

  async update(id: string, dto: UpdateAiCoachDto): Promise<AiCoach> {
    try {
      const coach = await this.findByIdOrFail(id);
      this.coachRepository.merge(coach, {
        name: dto.name,
        profile: dto.profile,
        role: dto.role,
        expected_outputs: dto.expected_outputs,
        status: dto.status
      });
      return await this.coachRepository.save(coach);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Mise à jour du coach impossible');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const coach = await this.findByIdOrFail(id);
      await this.coachRepository.softDelete(coach.id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Suppression du coach impossible');
    }
  }
}
