import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from './roles.enum';
import { Exclude, Expose } from 'class-transformer';
import { FeedPost } from '../../feed/entities/post.dto';

export class User {
  id?: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  username?: string;

  @IsNotEmpty()
  password: string;
  role?: Role;
  createdAt?: Date;
  post?: FeedPost[];
}
