import { v4 as uuidv4 } from "uuid";

import MgEntity, { Entity } from "../../models/entity.mgmodel";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/IEntityService";
import IFileStorageService from "../interfaces/storageService";
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
    } catch (error) {
      Logger.error(`Failed to get entities. Reason = ${error.message}`);
      throw error;
    }
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: Entity | null;
    const fileName = entity.filePath ? uuidv4() : "";
    try {
      newEntity = await MgEntity.create({ ...entity, fileName });
      if (entity.filePath) {
        this.storageService.createFile(
          fileName,
          entity.filePath,
          entity.fileContentType,
        );
      }
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
      if (entity.filePath) {
        if (currentFileName) {
          this.storageService.updateFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        } else {
          this.storageService.createFile(
            fileName,
            entity.filePath,
            entity.fileContentType,
          );
        }
      } else if (currentFileName) {
        this.storageService.deleteFile(currentFileName);
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
      fileName,
    };
  }

  async deleteEntity(id: string): Promise<void> {
    try {
      const deletedEntity: Entity | null = await MgEntity.findByIdAndDelete(id);
      if (!deletedEntity) {
        throw new Error(`Entity id ${id} not found`);
      }
      this.storageService.deleteFile(deletedEntity.fileName);
    } catch (error) {
      Logger.error(`Failed to delete entity. Reason = ${error.message}`);
      throw error;
    }
  }
}

export default EntityService;
