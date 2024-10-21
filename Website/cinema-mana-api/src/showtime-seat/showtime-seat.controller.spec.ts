import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeSeatController } from './showtime-seat.controller';
import { ShowtimeSeatService } from './showtime-seat.service';

describe('ShowtimeSeatController', () => {
  let controller: ShowtimeSeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimeSeatController],
      providers: [ShowtimeSeatService],
    }).compile();

    controller = module.get<ShowtimeSeatController>(ShowtimeSeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
