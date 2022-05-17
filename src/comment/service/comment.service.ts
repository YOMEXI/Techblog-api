import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { FeedService } from '../../feed/services/feed.service';
import { CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentPostRepository: Repository<CommentEntity>,
    private feedService: FeedService,
    private jwtService: JwtService,
  ) {}

  async createComment(id: number, comment: any, req: Request, res: Response) {
    const { body } = comment;
    let { cookie }: any = req.headers;

    let decodedCookie = this.jwtService.verify(String(cookie.split('=')[1]));

    let feed = await this.feedService.singlePost(id);
    let newComment = new CommentEntity();
    newComment.body = body;
    newComment.feedPost = feed;
    newComment.user = decodedCookie.validUser;

    const created = await this.commentPostRepository.save(newComment);
    if (!created) return res.json({ msg: 'Comments creation Failed' });
    if (created) return res.json({ msg: 'Comments created' });
  }
}
