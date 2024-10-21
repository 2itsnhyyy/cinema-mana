import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/constants';
import { BookingModule } from './booking/booking.module';
import { CustomerModule } from './customer/customer.module';
import { IsUniqueConstraint } from './decorator/is-unique.decorator';
import { IsKeyExistConstraint } from './decorator/key-exist.decorator';
import { EmployeeModule } from './employee/employee.module';
import { FileController } from './file/file.controller';
import { FileModule } from './file/file.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { MovieModule } from './movie/movie.module';
import { SeatSubscriber } from './seat/entities/seat.subcriber';
import { SeatModule } from './seat/seat.module';
import { S3FileService } from './services/files/s3-file.service';
import FileServiceAbtract from './services/files/upload-file.abstract.service';
import { ShowtimeSeatModule } from './showtime-seat/showtime-seat.module';
import { ShowtimeSubscriber } from './showtime/entities/showtime.subcriber';
import { ShowtimeModule } from './showtime/showtime.module';
import { TheaterRoomModule } from './theater-room/theater-room.module';
import { TicketModule } from './ticket/ticket.module';
import { JwtGlobalModule } from './jwt-global/jwt-global.module';
import { ShowtimeSeatSubscriber } from './showtime-seat/entities/showtime-seat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'admin',
      username: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      database: 'cinema_db',
      synchronize: true,
      logging: true,
      migrationsRun: false,
      subscribers: [ShowtimeSeatSubscriber, SeatSubscriber, ShowtimeSubscriber],
    }),
    TheaterRoomModule,
    SeatModule,
    EmployeeModule,
    AuthModule,
    MovieModule,
    FileModule,
    ShowtimeModule,
    ShowtimeSeatModule,
    BookingModule,
    TicketModule,
    CustomerModule,
    JwtGlobalModule,
  ],
  controllers: [AppController, FileController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    IsUniqueConstraint,
    IsKeyExistConstraint,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    {
      provide: FileServiceAbtract,
      useClass: S3FileService,
    },
  ],
})
export class AppModule {}
