// mongodb {
import { v4 as uuidv4 } from "uuid";

import MgEntity, { Entity } from "../../models/entity.model";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/IEntityService";
import IFileStorageService from "../interfaces/fileStorageService";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class EntityService implements IEntityService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

  /* eslint-disable class-methods-use-this */
  async getEntity(id: string): Promise<EntityResponseDTO> {
    let entity: Entity | null;
    try {
      entity = await MgEntity.findById(id);
      if (!entity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get entity. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: entity.id,
      stringField: entity.stringField,
      intField: entity.intField,
      enumField: entity.enumField,
      stringArrayField: entity.stringArrayField,
      boolField: entity.boolField,
      fileName: entity.fileName,
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
        fileName: entity.fileName,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get entities. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: Entity | null;
    const fileName = entity.filePath ? uuidv4() : "";
    try {
      if (entity.filePath) {
        await this.storageService.createFile(
          fileName,
          entity.filePath,
          entity.fileContentType,
        );
      }
      newEntity = await MgEntity.create({ ...entity, fileName });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: newEntity.id,
      stringField: newEntity.stringField,
      intField: newEntity.intField,
      enumField: newEntity.enumField,
      stringArrayField: newEntity.stringArrayField,
      boolField: newEntity.boolField,
      fileName,
    };
  }

  async updateEntity(
    id: string,
    entity: EntityRequestDTO,
  ): Promise<EntityResponseDTO | null> {
    let updatedEntity: Entity | null;
    let fileName = "";
    try {
      const currentEntity = await MgEntity.findById(id, "fileName");
      const currentFileName = currentEntity?.fileName;
      if (entity.filePath) {
        fileName = currentFileName || uuidv4();
        if (currentFileName) {
          await this.storageService.updateFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        } else {
          await this.storageService.createFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        }
      } else if (currentFileName) {
        await this.storageService.deleteFile(currentFileName);
      }
      updatedEntity = await MgEntity.findByIdAndUpdate(
        id,
        { ...entity, fileName },
        {
          new: true,
          runValidators: true,
        },
      );
      if (!updatedEntity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error: unknown) {
      Logger.error(
        `Failed to update entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: updatedEntity.id,
      stringField: updatedEntity.stringField,
      intField: updatedEntity.intField,
      enumField: updatedEntity.enumField,
      stringArrayField: updatedEntity.stringArrayField,
      boolField: updatedEntity.boolField,
      fileName,
    };
  }

  async deleteEntity(id: string): Promise<string> {
    try {
      const deletedEntity: Entity | null = await MgEntity.findByIdAndDelete(id);
      if (!deletedEntity) {
        throw new Error(`Entity id ${id} not found`);
      }
      if (deletedEntity.fileName) {
        await this.storageService.deleteFile(deletedEntity.fileName);
      }
      return id;
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default EntityService;

// } mongodb
// postgresql {
import { v4 as uuidv4 } from "uuid";

import PgEntity from "../../models/entity.model";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/IEntityService";
import IFileStorageService from "../interfaces/fileStorageService";
import { getErrorMessage } from "../../utilities/errorUtils";
import logger from "../../utilities/logger";

const Logger = logger(__filename);

class EntityService implements IEntityService {
  storageService: IFileStorageService;

  constructor(storageService: IFileStorageService) {
    this.storageService = storageService;
  }

  /* eslint-disable class-methods-use-this */
  async getEntity(id: string): Promise<EntityResponseDTO> {
    let entity: PgEntity | null;
    try {
      entity = await PgEntity.findByPk(id, { raw: true });
      if (!entity) {
        throw new Error(`Entity id ${id} not found`);
      }
    } catch (error: unknown) {
      Logger.error(`Failed to get entity. Reason = ${getErrorMessage(error)}`);
      throw error;
    }

    return {
      id: String(entity.id),
      stringField: entity.string_field,
      intField: entity.int_field,
      enumField: entity.enum_field,
      stringArrayField: entity.string_array_field,
      boolField: entity.bool_field,
      fileName: entity.file_name,
    };
  }

  async getEntities(): Promise<EntityResponseDTO[]> {
    try {
      const entities: Array<PgEntity> = await PgEntity.findAll({ raw: true });
      return entities.map((entity) => ({
        id: String(entity.id),
        stringField: entity.string_field,
        intField: entity.int_field,
        enumField: entity.enum_field,
        stringArrayField: entity.string_array_field,
        boolField: entity.bool_field,
        fileName: entity.file_name,
      }));
    } catch (error: unknown) {
      Logger.error(
        `Failed to get entities. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: PgEntity | null;
    const fileName = entity.filePath ? uuidv4() : "";
    try {
      if (entity.filePath) {
        await this.storageService.createFile(
          fileName,
          entity.filePath,
          entity.fileContentType,
        );
      }
      newEntity = await PgEntity.create({
        string_field: entity.stringField,
        int_field: entity.intField,
        enum_field: entity.enumField,
        string_array_field: entity.stringArrayField,
        bool_field: entity.boolField,
        file_name: fileName,
      });
    } catch (error: unknown) {
      Logger.error(
        `Failed to create entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(newEntity.id),
      stringField: newEntity.string_field,
      intField: newEntity.int_field,
      enumField: newEntity.enum_field,
      stringArrayField: newEntity.string_array_field,
      boolField: newEntity.bool_field,
      fileName,
    };
  }

  async updateEntity(
    id: string,
    entity: EntityRequestDTO,
  ): Promise<EntityResponseDTO | null> {
    let resultingEntity: PgEntity | null;
    let updateResult: [number, PgEntity[]] | null;
    let fileName = "";
    try {
      const currentEntity = await PgEntity.findByPk(id, {
        raw: true,
        attributes: ["file_name"],
      });
      const currentFileName = currentEntity?.file_name;
      if (entity.filePath) {
        fileName = currentFileName || uuidv4();
        if (currentFileName) {
          await this.storageService.updateFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        } else {
          await this.storageService.createFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        }
      } else if (currentFileName) {
        await this.storageService.deleteFile(currentFileName);
      }
      updateResult = await PgEntity.update(
        {
          string_field: entity.stringField,
          int_field: entity.intField,
          enum_field: entity.enumField,
          string_array_field: entity.stringArrayField,
          bool_field: entity.boolField,
          file_name: fileName,
        },
        { where: { id }, returning: true },
      );

      if (!updateResult[0]) {
        throw new Error(`Entity id ${id} not found`);
      }
      [, [resultingEntity]] = updateResult;
    } catch (error: unknown) {
      Logger.error(
        `Failed to update entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
    return {
      id: String(resultingEntity.id),
      stringField: resultingEntity.string_field,
      intField: resultingEntity.int_field,
      enumField: resultingEntity.enum_field,
      stringArrayField: resultingEntity.string_array_field,
      boolField: resultingEntity.bool_field,
      fileName,
    };
  }

  async deleteEntity(id: string): Promise<string> {
    try {
      const entityToDelete = await PgEntity.findByPk(id, { raw: true });
      const deleteResult: number | null = await PgEntity.destroy({
        where: { id },
      });

      if (!entityToDelete || !deleteResult) {
        throw new Error(`Entity id ${id} not found`);
      }
      if (entityToDelete.file_name) {
        await this.storageService.deleteFile(entityToDelete.file_name);
      }
      return id;
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete entity. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default EntityService;

// } postgresql