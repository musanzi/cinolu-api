import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CreateReview, UpdateReview } from '../commands';
import { CreateReviewDto, FilterReviewsDto, ReviewResponseDto, UpdateReviewDto } from '../dto';
import { Review } from '../entities';
import { FindMyReviews, FindReviewById, FindReviews } from '../queries';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController extends AbstractController {
  @Post()
  @ApiOperation({ summary: 'Create a review for an activity' })
  @ApiCreatedResponse({ description: 'Review created', type: ReviewResponseDto })
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateReviewDto): Promise<Review> {
    return this.commandHandler.execute(new CreateReview(user.id, dto));
  }

  @Get('mine')
  @ApiOperation({ summary: 'List reviews authored by the current user' })
  @ApiOkResponse({
    description: 'Paginated list of reviews: `items` is the page, `count` is the total number of matching reviews',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ReviewResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findMine(@CurrentUser() user: IUserResponse, @Query() query: FilterReviewsDto): Promise<[Review[], number]> {
    return this.queryHandler.execute(new FindMyReviews(user.id, query));
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  @ApiOperation({ summary: 'List all reviews with pagination (Staff only)' })
  @ApiOkResponse({
    description: 'Paginated list of reviews: `items` is the page, `count` is the total number of matching reviews',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(ReviewResponseDto) } },
        count: { type: 'integer' }
      }
    }
  })
  findForStaff(@Query() query: FilterReviewsDto): Promise<[Review[], number]> {
    return this.queryHandler.execute(new FindReviews(query));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({ name: 'id', description: 'ID of the review', format: 'uuid' })
  @ApiOkResponse({ description: 'Review with the given ID', type: ReviewResponseDto })
  findOne(@Param('id') id: string): Promise<Review> {
    return this.queryHandler.execute(new FindReviewById(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review authored by the current user' })
  @ApiParam({ name: 'id', description: 'ID of the review', format: 'uuid' })
  @ApiOkResponse({ description: 'Updated review', type: ReviewResponseDto })
  update(@CurrentUser() user: IUserResponse, @Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<Review> {
    return this.commandHandler.execute(new UpdateReview(user.id, id, dto));
  }
}
