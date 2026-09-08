import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCategory, DeleteCategory, UpdateCategory } from '../commands';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Category } from '../entities';
import { IFilterCategories } from '../interfaces';
import { FindCategories, FindCategoryById } from '../queries';

@Controller('categories')
export class CategoriesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.commandHandler.execute(new CreateCategory(dto));
  }

  @Get()
  findAll(@Query() query: IFilterCategories): Promise<[Category[], number]> {
    return this.queryHandler.execute(new FindCategories(query));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.queryHandler.execute(new FindCategoryById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<Category> {
    return this.commandHandler.execute(new UpdateCategory(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteCategory(id));
  }
}
