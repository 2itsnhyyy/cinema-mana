import { Module } from '@nestjs/common';
import { TheaterRoomService } from './theater-room.service';
import { TheaterRoomController } from './theater-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TheaterRoom } from './entities/theater-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TheaterRoom])],
  controllers: [TheaterRoomController],
  providers: [TheaterRoomService],
})
export class TheaterRoomModule {}
