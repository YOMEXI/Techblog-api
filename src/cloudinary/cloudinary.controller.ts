import { Controller, Post, Req, Res, UseGuards, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import * as formidable from 'formidable';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/entities/roles.enum';
import { JwtGuard } from '../auth/gaurds/jwt.guard';
import { RolesGuard } from '../auth/gaurds/roles.gaurds';

import { FeedPost } from '../feed/entities/post.dto';

import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}
  //
  @Roles(Role.USER, Role.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('upload')
  CreateFeed(@Req() req: Request, feedPost: FeedPost, @Res() res: Response) {
    return this.cloudinaryService.upload(req, feedPost, res);
  }

  @Post('register')
  Register(@Req() req: Request, feedPost: FeedPost, @Res() res: Response) {
    return this.cloudinaryService.Register(req, feedPost, res);
  }

  // @Roles(Role.USER, Role.PREMIUM)
  // @UseGuards(JwtGuard, RolesGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    res.cookie('token', '', { expires: new Date() });
    return res.json({ msg: 'Logged out' });
  }
}
