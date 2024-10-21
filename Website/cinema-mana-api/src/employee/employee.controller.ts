import {
  ArgumentMetadata,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Patch,
  PipeTransform,
  Post,
} from '@nestjs/common';
import { ResponseMessage } from '../decorator/response-message.decorator';
import { AttachFieldParamsToBodyDecorator } from '../shared/decorator';
import { EntityIdValidationPipe } from '../shared/validation';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';

@Injectable()
export class GetIdEmployeePipe implements PipeTransform<any> {
  constructor(private readonly employeeService: EmployeeService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    const id = parseInt(value, 10);
    let employee = await this.employeeService.findOne(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return id;
  }
}

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Employee created successfully')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @ResponseMessage('Get all employees successfully')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      EntityIdValidationPipe({
        entityClass: Employee,
        errorNotFoundMessage: 'Employee not found',
      }),
    )
    id: string,
  ) {
    return this.employeeService.findOne(+id);
  }

  @HttpCode(204)
  @Patch(':id')
  update(
    @Param(
      'id',
      EntityIdValidationPipe({
        entityClass: Employee,
        errorNotFoundMessage: 'Employee not found',
      }),
    )
    id: string,
    @AttachFieldParamsToBodyDecorator('id')
    updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(
    @Param(
      'id',
      EntityIdValidationPipe({
        entityClass: Employee,
        errorNotFoundMessage: 'Employee not found',
      }),
    )
    id: string,
  ) {
    return this.employeeService.remove(+id);
  }
}
