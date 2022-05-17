import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth/services/auth.service';

import { FeedPost } from '../entities/post.dto';
import { FeedService } from '../services/feed.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private feedService: FeedService,
    private jwtService: JwtService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let decodedCookie = this.jwtService.verify(
      String(request.headers.cookie.split('=')[1]),
    );
    const { id, role } = decodedCookie.validUser;
    const feedId = request.params.id;

    if (role === 'admin') return true;

    return this.feedService.singlePost(feedId).then((post: FeedPost) => {
      return post.author.id.toString() === id.toString();
    });
  }
}
