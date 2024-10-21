import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { EntityManager } from 'typeorm';

type EntityIdValidationPipeOptions = {
  entityClass: EntityClassOrSchema;
  errorNotFoundMessage?: string;
};

export const EntityIdValidationPipe = (
  options: EntityIdValidationPipeOptions,
) => {
  @Injectable()
  class EntityIdValidationMixinPipe {
    constructor(private readonly entityManager: EntityManager) {}
    async transform(id: string, metadata: ArgumentMetadata): Promise<string> {
      const exist = await this.entityManager
        .getRepository(options.entityClass)
        .createQueryBuilder()
        .where({ id })
        .getExists();
      if (!exist) {
        throw new NotFoundException(options.errorNotFoundMessage || 'Entity not found');
      }

      return id;
    }
  }
  return EntityIdValidationMixinPipe;
};
