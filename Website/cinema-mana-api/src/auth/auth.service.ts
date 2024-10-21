import { Employee } from './../employee/entities/employee.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { EmployeeService } from '../employee/employee.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeeService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ employee: Employee; accessToken: string }> {
    const employee = await this.employeesService.findOneByUsername(username);
    if (employee?.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: employee.id, username: employee.username };
    employee.password = undefined;
    return {
      employee,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
