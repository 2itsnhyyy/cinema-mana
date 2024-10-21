import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BookingController],
  providers: [BookingService, EmployeeService],
  imports: [JwtModule, TypeOrmModule.forFeature([Employee])],
})
export class BookingModule {}
