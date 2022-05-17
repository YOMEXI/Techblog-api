import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { v2 } from 'cloudinary';
let cloudinary = v2;
import { getRepository, Repository } from 'typeorm';
import * as formidable from 'formidable';
import { FeedPost } from '../feed/entities/post.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { FeedPostEntity } from '../feed/entities/post.entity';
import { AuthService } from '../auth/services/auth.service';

cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME),
  api_key: String(process.env.API_KEY),
  api_secret: String(process.env.API_SECRET),
});

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async upload(req: Request, feedPost: FeedPost, res: Response) {
    const form = formidable({ multiples: true });
    form.parse(req, async (err: any, fields: any, files: any) => {
      const decodedCookie = this.jwtService.verify(String(req.cookies.token));
      const { image } = files;
      const { body, category, title } = fields;

      let newFeed = new FeedPostEntity();
      newFeed.author = decodedCookie.validUser;
      newFeed.body = body;
      newFeed.likes = [];

      newFeed.category = category;
      newFeed.title = title;

      //
      if (image) {
        cloudinary.uploader.upload(
          image.filepath,
          {
            resource_type: 'auto',
            public_id: `feed/${image.filepath}`,
            overwrite: true,
          },
          async function (error, result) {
            newFeed.imgUrl = result.url;
            if (error) res.json({ msg: 'Upload Failed' });
            await getRepository(FeedPostEntity).save(newFeed);
            res.json({ msg: 'Upload Successfull' });
          },
        );
      } else {
        newFeed.imgUrl = '';
        await getRepository(FeedPostEntity).save(newFeed);
        res.json({ msg: 'Created' });
      }
    });
  }

  async Register(req: Request, feedPost: FeedPost, res: Response) {
    const form = formidable({ multiples: true });
    form.parse(req, async (err: any, fields: any, files: any) => {
      const { image } = files;
      const { email, password, username } = fields;

      let newUser = new UserEntity();
      newUser.email = email;
      newUser.username = username;
      newUser.password = await this.authService.hashPassword(password);

      //
      if (image) {
        cloudinary.uploader.upload(
          image.filepath,
          {
            resource_type: 'auto',
            public_id: `feed/user/${image.filepath}`,
            overwrite: true,
          },
          async function (error, result) {
            newUser.imgUrl = result.url;
            if (error) res.json({ msg: 'User Creation  Failed' });
            await getRepository(UserEntity).save(newUser);
            return res.json({ msg: 'User creation Done' });
          },
        );
      } else {
        await getRepository(UserEntity).save(newUser);
        return res.json({ msg: 'User creation Successfully !!' });
      }
    });
  }
}
