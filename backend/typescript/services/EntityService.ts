import { Entity, IEntity } from "../models/entity.mgmodel"

enum Options {
    A, B, C, D,
}

interface EntityRequestDTO {
    stringField: string;
    intField: number;
    enumField: Options;
    stringArrayField: [String];
    boolField: boolean;
}

const test = new Entity();

export interface EntityService {
    /* retrieve the Entity with the given id */
    getEntity(id: number): typeof Entity
    /* retrieve all Entities (pagination is nice-to-have future feature) */
    getEntities(): Promise<IEntity[]>
    /* create an Entity with the fields given in the DTO, return created Entity */
    createEntity(entity: EntityRequestDTO): typeof Entity;
    /* update the Entity with the given id with fields in the DTO, return updated Entity */
    updateEntity(id: number, entity: EntityRequestDTO): typeof Entity;
    /* delete the entity with the given id */
    deleteEntity(id: number): void;
}

export class EntityService {
    /* retrieve the Entity with the given id */
    // getEntity(id: number): IEntity {
    //     Entity.findById(id, function (err: Error, entity: Entity) {
    //         if (err) return err;
    //         return entity;
    //     })
    // }
    /* retrieve all Entities (pagination is nice-to-have future feature) */
    async getEntities(): Promise<IEntity[]> {
        return await Entity.find();
    }

    /* create an Entity with the fields given in the DTO, return created Entity */
    // async createEntity(entity: EntityRequestDTO): IEntity {
    //     try {
    //         const res = await Entity.create(entity);
    //         return res
    //     } catch (error) {
    //         console.error(error)
    //         // handle the error
    //     }
    // }
    // /* update the Entity with the given id with fields in the DTO, return updated Entity */
    // updateEntity(id: number, entity: EntityRequestDTO): IEntity {

    // }
    // /* delete the entity with the given id */
    // deleteEntity(id: number): void {
    //     return;
    // }
}

export default EntityService;