import { PartialType } from '@nestjs/mapped-types';
import { CreateVentureCategoryDto } from './create-venture-category.dto';

export class UpdateVentureCategoryDto extends PartialType(CreateVentureCategoryDto) {}
