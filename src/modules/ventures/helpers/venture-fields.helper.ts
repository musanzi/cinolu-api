import { CreateVentureDto, UpdateVentureDto } from '../dto';
import { Venture } from '../entities';

export const getVentureFields = (dto: CreateVentureDto | UpdateVentureDto): Partial<Venture> => {
  const fields: Partial<Venture> = {};

  if (dto.name !== undefined) fields.name = dto.name;
  if (dto.pitch !== undefined) fields.pitch = dto.pitch;
  if (dto.description !== undefined) fields.description = dto.description;
  if (dto.logo !== undefined) fields.logo = dto.logo;
  if (dto.links !== undefined) fields.links = dto.links;

  return fields;
};
