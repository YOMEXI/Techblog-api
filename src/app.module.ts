import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryController } from './cloudinary/cloudinary.controller';
import { cloudinaryModule } from './cloudinary/cloudinaryModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development' ? true : false,
    }),
    FeedModule,
    AuthModule,
    CommentModule,
    cloudinaryModule,
  ],
  controllers: [AppController, CloudinaryController],
  providers: [AppService, CloudinaryService, FeedModule, TypeOrmModule],
})
export class AppModule {}
