import { forwardRef, Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './entities/post.entity';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { IsCreatorGuard } from './gaurds/is-creator.guard';
import { AuthModule } from '../auth/auth.module';
import { cloudinaryModule } from '../cloudinary/cloudinaryModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedPostEntity]),
    AuthModule,
    PassportModule,
    cloudinaryModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController],

  exports: [TypeOrmModule, IsCreatorGuard, FeedService, cloudinaryModule],
})
export class FeedModule {}
