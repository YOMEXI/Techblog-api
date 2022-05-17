import * as dotenv from 'dotenv';
dotenv.config();

import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './gaurds/jwt.guard';
import { JwtStrategy } from './gaurds/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './gaurds/roles.gaurds';
import { CommentEntity } from './../comment/entities/comment.entity';
import { CommentModule } from './../comment/comment.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60d' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule,
    JwtGuard,
    RolesGuard,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
