import { Test, TestingModule } from '@nestjs/testing';
import { TheaterRoomService } from './theater-room.service';

describe('TheaterRoomService', () => {
  let service: TheaterRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TheaterRoomService],
    }).compile();

    service = module.get<TheaterRoomService>(TheaterRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
