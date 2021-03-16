import { Entity } from "../../models/entity.mgmodel";

enum Options {
    A, B, C, D,
}

export interface EntityRequestDTO {
    stringField: string;
    intField: number;
    enumField: string;
    stringArrayField: [string];
    boolField: boolean;
}

export interface IEntityService {
    /**
   * retrieve the Entity with the given id
   * @param id entity id
   * @returns requested Entity
   */
    getEntity(id: string): Promise<Entity>

    /**
   * retrieve all Entities
   * @param 
   * @returns returns array of Entities
   */
    getEntities(): Promise<Entity[]>

    /**
   * create an Entity with the fields given in the DTO, return created Entity
   * @param entity user's email
   * @returns the created Entity
   */
    createEntity(entity: Entity): Promise<Entity>;

    /**
   * update the Entity with the given id with fields in the DTO, return updated Entity
   * @param id entity id
   * @param entity Updated Entity
   * @returns the updated Entity
   */
    updateEntity(id: string, entity: Entity): Promise<Entity | null>;

    /**
   * delete the entity with the given id
   * @param id entity id
   * @returns nothing
   */
    deleteEntity(id: string): void;
}
