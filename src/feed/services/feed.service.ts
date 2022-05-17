import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { FeedPost } from '../entities/post.dto';
import { FeedPostEntity } from '../entities/post.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
    private jwtService: JwtService,
  ) {}

  async findAllPosts(
    currentPg: number,
    postPerPg: number,
  ): Promise<FeedPost[]> {
    return await this.feedPostRepository.find({
      order: { createdAt: 'ASC' },
      skip: currentPg * postPerPg,
      take: postPerPg,
      relations: ['author', 'comment'],
    });
  }

  async updateOnePost(id: number, feedPost: FeedPost): Promise<UpdateResult> {
    return await this.feedPostRepository.update(id, feedPost);
  }

  deleteOnePost(id: number): Promise<DeleteResult> {
    return this.feedPostRepository.delete(id);
  }

  async singlePost(id: number) {
    return await this.feedPostRepository.findOne(
      { id },
      { relations: ['author', 'comment', 'comment.user'] },
    );
  }

  async likeAFeed(id: number, req: Request): Promise<any> {
    let { cookie }: any = req.headers;

    let decodedCookie = this.jwtService.verify(String(cookie.split('=')[1]));

    let user = decodedCookie.validUser;

    let feed = await this.feedPostRepository.findOne({ id });

    //
    const isLiked =
      feed.likes.filter((like) => Number(like) === Number(user.id)).length > 0;

    if (isLiked) {
      throw new HttpException('Post Already Liked', HttpStatus.FORBIDDEN);
    }
    feed.likes.unshift(user.id);

    return await this.feedPostRepository.save(feed);
    //
  }

  async unlikeAFeed(id: number, req: Request): Promise<any> {
    let { cookie }: any = req.headers;

    let decodedCookie = this.jwtService.verify(String(cookie.split('=')[1]));

    let user = decodedCookie.validUser;

    let feed = await this.feedPostRepository.findOne({ id });

    //
    const isLiked =
      feed.likes.filter((like) => Number(like) === Number(user.id)).length > 0;

    if (!isLiked) {
      throw new HttpException('Post Not Liked By you', HttpStatus.FORBIDDEN);
    }

    //
    const index = feed.likes
      .map((like) => Number(like))
      .indexOf(Number(user.id));

    feed.likes.splice(index, 1);

    return await this.feedPostRepository.save(feed);
    //
  }
  async findFeedByCategory(
    category: string,
    currentPg: number,
    postPerPg: number,
  ) {
    return await this.feedPostRepository.find({
      relations: ['author', 'comment'],
      order: { createdAt: 'ASC' },
      skip: currentPg * postPerPg,
      take: postPerPg,
      where: { category },
    });
  }
}
