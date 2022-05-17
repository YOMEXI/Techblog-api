import { IsNotEmpty, min } from 'class-validator';
import { User } from 'src/auth/entities/user.dto';

export class FeedPost {
  id?: number;

  @IsNotEmpty({ message: 'Feed Body cannot be empty' })
  body: string;
  createdAt?: Date;
  author?: User;
  likes?: any[];
  category?: string;
  imgUrl?: string;
}

export interface CommentPost {
  id: number;
  body: string;
  createdAt?: Date;
  author?: User;
  feedPost: any;
  user: User;
  updatedAt?: Date;
}
