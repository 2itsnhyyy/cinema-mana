import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    let customer = await this.customerRepo.findOne({
      where: { phoneNumber: createCustomerDto.phoneNumber },
    });

    if (customer) {
      throw new BadRequestException('Phone number already exists');
    }

    return this.customerRepo.save(createCustomerDto);
  }

  findAll(phone: string | undefined) {
    if (phone) {
      return this.customerRepo.find({ where: { phoneNumber: phone } });
    }

    return this.customerRepo.find();
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.customerRepo.update(id, updateCustomerDto);
  }
}
