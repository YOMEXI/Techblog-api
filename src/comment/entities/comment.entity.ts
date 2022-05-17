import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { FeedPostEntity } from '../../feed/entities/post.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 3000, default: '' })
  body: string;

  @ManyToOne(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.comment)
  feedPost: FeedPostEntity;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.comments, {
    cascade: true,
  })
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
