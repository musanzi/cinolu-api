import { CurrentUser, HasRoles } from '@/modules/auth/decorators';
import { Roles } from '@/modules/auth/enums';
import { IUserResponse } from '@/modules/users/interfaces';
import { AbstractController } from '@/shared/abstracts';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateReview, UpdateReview } from '../commands';
import { CreateReviewDto, UpdateReviewDto } from '../dto';
import { Review } from '../entities';
import { IFilterReviews } from '../interfaces';
import { FindMyReviews, FindOwnedReviewById, FindReviewById, FindReviews } from '../queries';

@Controller('reviews')
export class ReviewsController extends AbstractController {
  @Post()
  create(@CurrentUser() user: IUserResponse, @Body() dto: CreateReviewDto): Promise<Review> {
    return this.commandHandler.execute(new CreateReview(user.id, dto));
  }

  @Get('mine')
  findMine(@CurrentUser() user: IUserResponse, @Query() query: IFilterReviews): Promise<[Review[], number]> {
    return this.queryHandler.execute(new FindMyReviews(user.id, query));
  }

  @Get('mine/:id')
  findOneMine(@CurrentUser() user: IUserResponse, @Param('id') id: string): Promise<Review> {
    return this.queryHandler.execute(new FindOwnedReviewById(id, user.id));
  }

  @Get('staff')
  @HasRoles([Roles.STAFF])
  findForStaff(@Query() query: IFilterReviews): Promise<[Review[], number]> {
    return this.queryHandler.execute(new FindReviews(query));
  }

  @Get('staff/:id')
  @HasRoles([Roles.STAFF])
  findOneForStaff(@Param('id') id: string): Promise<Review> {
    return this.queryHandler.execute(new FindReviewById(id));
  }

  @Patch(':id')
  update(@CurrentUser() user: IUserResponse, @Param('id') id: string, @Body() dto: UpdateReviewDto): Promise<Review> {
    return this.commandHandler.execute(new UpdateReview(user.id, id, dto));
  }
}
