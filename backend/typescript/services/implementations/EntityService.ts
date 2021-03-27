import MgEntity, { Entity } from "../../models/entity.mgmodel";
import {
  IEntityService,
  EntityRequestDTO,
  EntityResponseDTO,
} from "../interfaces/IEntityService";

export class EntityService implements IEntityService {
  async getEntity(id: string): Promise<EntityResponseDTO> {
    let entity: Entity | null;
    try {
      entity = await MgEntity.findById(id);
    }
    catch (e) {
      throw new Error(e.message);
    }
    if (!entity) {
      throw new Error(`Entity id ${id} not found.`);
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
    const entityDtos: Array<EntityResponseDTO> = [];
    try {
      const entities: Array<Entity> = await MgEntity.find();
      entities.map((entity) => {
        const entityRequestDto = {
          id: entity.id,
          stringField: entity.stringField,
          intField: entity.intField,
          enumField: entity.enumField,
          stringArrayField: entity.stringArrayField,
          boolField: entity.boolField,
        };
        entityDtos.push(entityRequestDto);
      });
    } catch (e) {
      throw new Error(`entities not found`);
    }
    return entityDtos;
  }

  async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
    let newEntity: Entity | null;
    try {
      newEntity = await MgEntity.create(entity);
    } catch (error) {
      throw new Error(`Cannot create entity`);
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

  async updateEntity(id: string, entity: EntityRequestDTO): Promise<EntityResponseDTO | null> {
    let updatedEntity: Entity | null;
    try {
      updatedEntity = await MgEntity.findByIdAndUpdate({ _id: id }, entity, {
        new: true,
        runValidators: true,
      });
      if (updatedEntity == null) {
        throw new Error(`Error: ${id} not found`);
      }
    } catch (error) {
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
    const deletedEntity: Entity | null = await MgEntity.findByIdAndDelete(id);

    if (!deletedEntity) {
      throw new Error(`Entity id ${id} not found.`);
    }
  }
}

export default EntityService;
