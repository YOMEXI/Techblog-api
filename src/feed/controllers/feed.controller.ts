import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtGuard } from '../../auth/gaurds/jwt.guard';
import { FeedPost } from '../entities/post.dto';
import { IsCreatorGuard } from '../gaurds/is-creator.guard';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  findAllPosts(
    @Query('page') page: number,
    @Query('count') count: number,
  ): Promise<FeedPost[]> {
    const currentPg = page || 0;
    const postPerPg = count || 3;
    return this.feedService.findAllPosts(currentPg, postPerPg);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(':id')
  updateOnePost(
    @Param('id') id: number,
    @Body() feedpost: FeedPost,
  ): Promise<UpdateResult> {
    return this.feedService.updateOnePost(id, feedpost);
  }

  @Get(':id')
  async singlePost(@Param('id') id: number): Promise<FeedPost> {
    return await this.feedService.singlePost(id);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(':id')
  deleteOnePost(@Param('id') id: number): Promise<DeleteResult> {
    return this.feedService.deleteOnePost(id);
  }

  @UseGuards(JwtGuard)
  @Post('/like/:postId')
  likeAFeed(@Param('postId') postId: number, @Request() req: Request) {
    return this.feedService.likeAFeed(postId, req);
  }

  @UseGuards(JwtGuard)
  @Post('/unlike/:postId')
  unlikeAFeed(@Param('postId') postId: number, @Request() req: Request) {
    return this.feedService.unlikeAFeed(postId, req);
  }

  @UseGuards(JwtGuard)
  @Get('/feedbycategory/:category')
  findFeedByCategory(
    @Param('category') category: string,
    @Request() req: Request,
    @Query('page') page: number,
    @Query('count') count: number,
  ) {
    const currentPg = page || 0;
    const postPerPg = count || 3;
    return this.feedService.findFeedByCategory(category, currentPg, postPerPg);
  }
}
