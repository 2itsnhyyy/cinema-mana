import {
  IsAlphanumeric,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';
import { IsUnique } from '../../decorator/is-unique.decorator';
import {
  Employee,
  EmployeeGender,
  EmployeeRole,
} from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(2, { message: 'Name must have at least 2 characters.' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Employee name must have atleast 3 characters.' })
  @IsAlphanumeric('en-US', {
    message: 'Employee name does not allow other than alpha numeric chars.',
  })
  @IsUnique({ entityClass: Employee, column: 'username' })
  username: string;

  @IsNotEmpty()
  // @IsEmail(null, { message: 'Please provide valid Email.' })
  phoneNumber: string;

  @IsDateString()
  birthDate: Date;

  @IsEnum(EmployeeGender, {
    message: `Gender must be one of these values: ${Object.values(EmployeeGender)}`,
  })
  gender: EmployeeGender;

  @IsString()
  address: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  identityCard: string;

  @IsNotEmpty()
  @IsEnum(EmployeeRole, {
    message: `Role must be one of these values: ${Object.values(EmployeeRole)}`,
  })
  role: EmployeeRole = EmployeeRole.EMPLOYEE;
}
