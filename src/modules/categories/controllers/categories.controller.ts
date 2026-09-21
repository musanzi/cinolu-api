import { HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath
} from '@nestjs/swagger';
import { CreateCategory, DeleteCategory, UpdateCategory } from '../commands';
import { CategoryResponseDto, CreateCategoryDto, FilterCategoriesDto, UpdateCategoryDto } from '../dto';
import { Category } from '../entities';
import { FindCategories, FindCategoryById } from '../queries';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController extends AbstractController {
  @Post()
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Create a category', description: 'Staff only.' })
  @ApiCreatedResponse({ description: 'Category created', type: CategoryResponseDto })
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.commandHandler.execute(new CreateCategory(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List categories' })
  @ApiOkResponse({
    description: 'Paginated list of categories returned as a [items, count] tuple',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(CategoryResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findAll(@Query() query: FilterCategoriesDto): Promise<[Category[], number]> {
    return this.queryHandler.execute(new FindCategories(query));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({ name: 'id', description: 'Category id', format: 'uuid' })
  @ApiOkResponse({ description: 'Category details', type: CategoryResponseDto })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.queryHandler.execute(new FindCategoryById(id));
  }

  @Patch(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Update a category', description: 'Staff only.' })
  @ApiParam({ name: 'id', description: 'Category id', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated category', type: CategoryResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto): Promise<Category> {
    return this.commandHandler.execute(new UpdateCategory(id, dto));
  }

  @Delete(':id')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'Delete a category', description: 'Staff only.' })
  @ApiParam({ name: 'id', description: 'Category id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Category deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.commandHandler.execute(new DeleteCategory(id));
  }
}
