import { Exclude, instanceToPlain } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { EmployeeGender, EmployeeRole } from '../../shared/enum';

export { EmployeeGender, EmployeeRole };

@Entity({ name: 'employees' })
@Unique(['username'])
export class Employee {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column({ type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  identityCard: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'enum', enum: EmployeeGender, default: EmployeeGender.MALE })
  gender: EmployeeGender;

  @Column({ type: 'enum', enum: EmployeeRole, default: EmployeeRole.EMPLOYEE })
  role: EmployeeRole;

  @DeleteDateColumn()
  deletedAt?: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
