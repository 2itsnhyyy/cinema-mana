import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TheaterRoomService } from './theater-room.service';
import { CreateTheaterRoomDto } from './dto/create-theater-room.dto';
import { UpdateTheaterRoomDto } from './dto/update-theater-room.dto';
import { AttachFieldParamsToBodyDecorator } from '../shared/decorator';

@Controller('theater-rooms')
export class TheaterRoomController {
  constructor(private readonly theaterRoomService: TheaterRoomService) {}

  @Post()
  create(@Body() createTheaterRoomDto: CreateTheaterRoomDto) {
    return this.theaterRoomService.create(createTheaterRoomDto);
  }

  @Get()
  findAll() {
    return this.theaterRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theaterRoomService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @AttachFieldParamsToBodyDecorator('id')
    @Body()
    updateTheaterRoomDto: UpdateTheaterRoomDto,
  ) {
    console.log('id: ', id);
    return this.theaterRoomService.update(+id, updateTheaterRoomDto);
  }
}
