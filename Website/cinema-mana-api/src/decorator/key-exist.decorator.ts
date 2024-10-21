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

@ValidatorConstraint({ name: 'IsKeyExistConstraint', async: true })
@Injectable()
export class IsKeyExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // catch options from decorator
    const { entityClass, column }: IsKeyExistInterface = args.constraints[0];

    const dataExist = await this.entityManager
      .getRepository(entityClass)
      .createQueryBuilder()
      .where({
        [column]: value,
      })
      .getExists();

    return dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    // return custom field message
    const field: string = validationArguments.property;
    return `${field} is not exists`;
  }
}

// decorator options interface
export type IsKeyExistInterface = {
  entityClass: EntityClassOrSchema;
  column: string;
};

// decorator function
export function IsKeyExist(
  options: IsKeyExistInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsKeyExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsKeyExistConstraint,
    });
  };
}
