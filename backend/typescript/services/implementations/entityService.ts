// mongodb {
import MgEntity, { Entity } from "../../models/entity.model";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/IEntityService";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class EntityService implements IEntityService {
  /* eslint-disable class-methods-use-this */
  async getEntity(id: string): Promise<EntityResponseDTO> {
    let entity: Entity | null;
    try {
      entity = await MgEntity.findById(id);
      if (!entity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to get entity. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: entity.id,
      stringField: entity.stringField,
      intField: entity.intField,
      enumField: entity.enumField,
      stringArrayField: entity.stringArrayField,
      boolField: entity.boolField,
    };
  }

  async getEntities(): Promise<EntityResponseDTO[]> {
    try {
      const entities: Array<Entity> = await MgEntity.find();
      return entities.map((entity) => ({
        id: entity.id,
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      }));
    } catch (error) {
      Logger.error(`Failed to get entities. Reason = ${error.message}`);
      throw error;
    }
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: Entity | null;
    try {
      newEntity = await MgEntity.create(entity);
    } catch (error) {
      Logger.error(`Failed to create entity. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: newEntity.id,
      stringField: newEntity.stringField,
      intField: newEntity.intField,
      enumField: newEntity.enumField,
      stringArrayField: newEntity.stringArrayField,
      boolField: newEntity.boolField,
    };
  }

  async updateEntity(
    id: string,
    entity: EntityRequestDTO,
  ): Promise<EntityResponseDTO | null> {
    let updatedEntity: Entity | null;
    try {
      updatedEntity = await MgEntity.findByIdAndUpdate(id, entity, {
        new: true,
        runValidators: true,
      });
      if (!updatedEntity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to update entity. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: updatedEntity.id,
      stringField: updatedEntity.stringField,
      intField: updatedEntity.intField,
      enumField: updatedEntity.enumField,
      stringArrayField: updatedEntity.stringArrayField,
      boolField: updatedEntity.boolField,
    };
  }

  async deleteEntity(id: string): Promise<void> {
    try {
      const deletedEntity: Entity | null = await MgEntity.findByIdAndDelete(id);
      if (!deletedEntity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete entity. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default EntityService;

// } mongodb
// postgresql {
import PgEntity from "../../models/entity.model";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/IEntityService";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class EntityService implements IEntityService {
  /* eslint-disable class-methods-use-this */
  async getEntity(id: string): Promise<EntityResponseDTO> {
    let entity: PgEntity | null;
    try {
      entity = await PgEntity.findByPk(id, { raw: true });
      if (!entity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to get entity. Reason = ${error.message}`);
      throw error;
    }

    return {
      id: entity.id,
      stringField: entity.string_field,
      intField: entity.int_field,
      enumField: entity.enum_field,
      stringArrayField: entity.string_array_field,
      boolField: entity.bool_field,
    };
  }

  async getEntities(): Promise<EntityResponseDTO[]> {
    try {
      const entities: Array<PgEntity> = await PgEntity.findAll({ raw: true });
      return entities.map((entity) => ({
        id: entity.id,
        stringField: entity.string_field,
        intField: entity.int_field,
        enumField: entity.enum_field,
        stringArrayField: entity.string_array_field,
        boolField: entity.bool_field,
      }));
    } catch (error) {
      Logger.error(`Failed to get entities. Reason = ${error.message}`);
      throw error;
    }
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: PgEntity | null;
    try {
      newEntity = await PgEntity.create({
        string_field: entity.stringField,
        int_field: entity.intField,
        enum_field: entity.enumField,
        string_array_field: entity.stringArrayField,
        bool_field: entity.boolField,
      });
    } catch (error) {
      Logger.error(`Failed to create entity. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: newEntity.id,
      stringField: newEntity.string_field,
      intField: newEntity.int_field,
      enumField: newEntity.enum_field,
      stringArrayField: newEntity.string_array_field,
      boolField: newEntity.bool_field,
    };
  }

  async updateEntity(
    id: string,
    entity: EntityRequestDTO,
  ): Promise<EntityResponseDTO | null> {
    let resultingEntity: PgEntity | null;
    let updateResult: [number, PgEntity[]] | null;
    try {
      updateResult = await PgEntity.update(
        {
          string_field: entity.stringField,
          int_field: entity.intField,
          enum_field: entity.enumField,
          string_array_field: entity.stringArrayField,
          bool_field: entity.boolField,
        },
        { where: { id }, returning: true },
      );

      if (!updateResult[0]) {
        throw new Error(`Entity id ${id} not found`);
      }
      [, [resultingEntity]] = updateResult;
    } catch (error) {
      Logger.error(`Failed to update entity. Reason = ${error.message}`);
      throw error;
    }
    return {
      id: resultingEntity.id,
      stringField: resultingEntity.string_field,
      intField: resultingEntity.int_field,
      enumField: resultingEntity.enum_field,
      stringArrayField: resultingEntity.string_array_field,
      boolField: resultingEntity.bool_field,
    };
  }

  async deleteEntity(id: string): Promise<void> {
    try {
      const deletedEntity: number | null = await PgEntity.destroy({
        where: { id },
      });

      if (!deletedEntity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error) {
      Logger.error(`Failed to delete entity. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default EntityService;

// } postgresql