import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { Repository } from 'typeorm';
import { User } from '../entities/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 11);
  }

  async validateUser(email: string, password: string): Promise<User> {
    return;
  }

  async login(user: User): Promise<any> {
    const { email, password } = user;
    let validUser = await this.userRepository.findOne(
      { email },
      { select: ['id', 'email', 'password', 'username', 'role', 'password'] },
    );

    const validPassword: boolean = await bcrypt.compare(
      password,
      validUser.password,
    );

    if (!validUser || !validPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Email or Password is incorrect',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    validUser.password = '';
    const token = await this.jwtService.signAsync({ validUser });
    if (validUser && validPassword) {
      return { token, validUser };
    }

    return { token, validUser };
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    console.log(username);
    return user;
  }
}
