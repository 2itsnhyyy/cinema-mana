import { Module } from '@nestjs/common';
import { EmployeeModule } from '../employee/employee.module';
import { JwtGlobalModule } from '../jwt-global/jwt-global.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtGlobalModule, EmployeeModule],
  controllers: [AuthController],
  providers: [AuthService,],
  exports: [AuthService],
})
export class AuthModule {}
