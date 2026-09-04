import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityCategoryDto } from './create-activity-category.dto';

export class UpdateActivityCategoryDto extends PartialType(CreateActivityCategoryDto) {}
