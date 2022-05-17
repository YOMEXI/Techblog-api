import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { CommentEntity } from '../../comment/entities/comment.entity';

@Entity('feedpost')
export class FeedPostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 3000, default: '' })
  body: string;

  @Column('varchar', { length: 3000, default: '' })
  imgUrl: string;

  @Column('varchar', { length: 3000, default: '' })
  category: string;

  @Column('varchar', { length: 3000, default: '' })
  title: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.feedPost, {
    cascade: true,
  })
  author: UserEntity;

  @OneToMany(() => CommentEntity, (commentEntity) => commentEntity.feedPost)
  comment: CommentEntity[];

  @Column('int', { array: true })
  likes: number[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
