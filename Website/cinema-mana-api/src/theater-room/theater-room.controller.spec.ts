import { Test, TestingModule } from '@nestjs/testing';
import { TheaterRoomController } from './theater-room.controller';
import { TheaterRoomService } from './theater-room.service';

describe('TheaterRoomController', () => {
  let controller: TheaterRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheaterRoomController],
      providers: [TheaterRoomService],
    }).compile();

    controller = module.get<TheaterRoomController>(TheaterRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
