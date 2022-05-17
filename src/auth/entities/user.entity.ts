import { Exclude } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommentEntity } from '../../comment/entities/comment.entity';
import { FeedPostEntity } from '../../feed/entities/post.entity';
import { Role } from './roles.enum';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  imgUrl: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.author)
  feedPost: FeedPostEntity[];

  @OneToOne(() => CommentEntity, (commentEntity) => commentEntity.user)
  comments: CommentEntity;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
