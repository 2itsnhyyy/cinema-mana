import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '../../decorator/is-unique.decorator';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Employee } from '../entities/employee.entity';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['password', 'username'] as const),
) {
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  password?: string;
  @IsUnique({ entityClass: Employee, column: 'username', notEqualBy: 'id' })
  username: string;
}
