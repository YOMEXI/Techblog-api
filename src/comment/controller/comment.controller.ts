import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../../auth/gaurds/jwt.guard';
import { CommentPost } from '../../feed/entities/post.dto';
import { CommentService } from '../service/comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @Post(':postId')
  async createComment(
    @Param('postId') postId: number,
    @Body() commentpost: CommentPost,
    @Request() req: Request,
    @Res() res: Response,
  ) {
    return await this.commentService.createComment(
      postId,
      commentpost,
      req,
      res,
    );
  }
}
