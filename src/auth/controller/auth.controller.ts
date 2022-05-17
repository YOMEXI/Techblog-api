import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { User } from '../entities/user.dto';
import { AuthService } from '../services/auth.service';

import { Response } from 'express';
import * as cookie from 'cookie';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: User, @Res({ passthrough: true }) res: Response) {
    const value = await this.authService.login(user);
    res.cookie('token', value.token, {
      sameSite: 'none',
      maxAge: 3600000,
      path: '/',
      httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      secure: true,
      //for postman testing
      // httpOnly: process.env.NODE_ENV === 'production' ? true : false,
      // secure: process.env.NODE_ENV === 'production' ? true : false,
    });
    return value.validUser;
  }

  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    return await this.authService.findUserByUsername(username);
  }
}
