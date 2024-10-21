import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { EntityManager, Not } from 'typeorm';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // catch options from decorator
    const { entityClass, column, notEqualBy }: IsUniqeInterface =
      args.constraints[0];

    console.log('args.object: ', args.object);
    console.log('tableName + column: ', entityClass, column);

    // database query check data is exists
    const dataExist = await this.entityManager
      .getRepository(entityClass)
      .createQueryBuilder()
      .where({
        [column]: value,
        ...(notEqualBy ? { [notEqualBy]: Not(args.object[notEqualBy]) } : {}),
      })
      .getExists();

    return !dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    // return custom field message
    const field: string = validationArguments.property;
    return `${field} is already exist`;
  }
}

// decorator options interface
export type IsUniqeInterface = {
  entityClass: EntityClassOrSchema;
  column: string;
  notEqualBy?: string;
};

// decorator function
export function IsUnique(
  options: IsUniqeInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    console.log('options: ', options);
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
