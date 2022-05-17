import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({})
export class cloudinaryModule {
  providers: [CloudinaryService];
  exports: [CloudinaryService];
}
