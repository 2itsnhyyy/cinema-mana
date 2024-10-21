import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeSeatService } from './showtime-seat.service';

describe('ShowtimeSeatService', () => {
  let service: ShowtimeSeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowtimeSeatService],
    }).compile();

    service = module.get<ShowtimeSeatService>(ShowtimeSeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
