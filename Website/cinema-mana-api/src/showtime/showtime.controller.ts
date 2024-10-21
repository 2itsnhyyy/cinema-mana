import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseMessage } from '../decorator/response-message.decorator';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimeQueryFilterDto } from './dto/showtime-query-filter.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ShowtimeService } from './showtime.service';

@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Showtime created')
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimeService.create(createShowtimeDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filter: ShowtimeQueryFilterDto) {
    return this.showtimeService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.showtimeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    return this.showtimeService.update(+id, updateShowtimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimeService.remove(+id);
  }
}
