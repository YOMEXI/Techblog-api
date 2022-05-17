import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentService } from './service/comment.service';
import { CommentController } from './controller/comment.controller';
import { CommentEntity } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), AuthModule, FeedModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
