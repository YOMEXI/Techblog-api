import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedPost } from '../entities/post.dto';
import { FeedPostEntity } from '../entities/post.entity';
import { FeedService } from './feed.service';

describe('feedService Rest', () => {
  let feedService: FeedService;
  let feedPostRepository: Repository<FeedPostEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(FeedPostEntity),
          useValue: {
            find: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
      controllers: [],
      imports: [],
    }).compile();

    feedService = module.get<FeedService>(FeedService);
    feedPostRepository = module.get<Repository<FeedPostEntity>>(
      getRepositoryToken(FeedPostEntity),
    );
  });
  it('should update feed', async () => {
    const repoSpy = jest
      .spyOn(feedPostRepository, 'update')
      .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

    expect(
      feedService.updateOnePost(1, { body: 'Tailwind over bootstrap' }),
    ).resolves.toEqual({
      generatedMaps: [],
      raw: [],
      affected: 1,
    });

    expect(repoSpy).toBeCalledWith(1, { body: 'Tailwind over bootstrap' });
  });

  describe('Should delete a feed', () => {
    it('Delete a whole feed', async () => {
      expect(feedService.deleteOnePost(2)).resolves.toEqual([]);
    });
  });
});
