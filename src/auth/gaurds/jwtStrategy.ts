import dotenv from 'dotenv/config';

import { Injectable, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { cookieExtractor } from './utils';

let req = Request;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_Expires },
    });
  }

  async validate(payload: any) {
    return { ...payload.user };
  }
}
