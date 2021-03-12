import { Entity, IEntity } from "../models/entity.mgmodel"
var mongoose = require('mongoose');
enum Options {
    A, B, C, D,
}

interface EntityRequestDTO {
    string_field: string;
    int_field: number;
    enum_field: Options;
    string_array_field: [String];
    bool_field: boolean;
}

const test = new Entity();

export interface EntityService {
    /* retrieve the Entity with the given id */
    getEntity(id: number): Promise<IEntity | null>
    /* retrieve all Entities (pagination is nice-to-have future feature) */
    getEntities(): Promise<IEntity[]>
    /* create an Entity with the fields given in the DTO, return created Entity */
    createEntity(entity: EntityRequestDTO): Promise<IEntity>;
    /* update the Entity with the given id with fields in the DTO, return updated Entity */
    updateEntity(id: number, entity: IEntity): Promise<IEntity | null>;
    /* delete the entity with the given id */
    deleteEntity(id: string): void;
}

export class EntityService {

    /* retrieve the Entity with the given id */
    async getEntity(id: number): Promise<IEntity | null> {
        return await Entity.findById(id);
    }

    /* retrieve all Entities (pagination is nice-to-have future feature) */
    async getEntities(): Promise<IEntity[]> {
        return await Entity.find();
    }

    /* create an Entity with the fields given in the DTO, return created Entity */
    async createEntity(entity: EntityRequestDTO): Promise<IEntity> {
        return await Entity.create(entity);
    }
    /* update the Entity with the given id with fields in the DTO, return updated Entity */
    async updateEntity(id: number, entity: IEntity): Promise<IEntity | null> {
        // const IEntityObject: IEntity = {
        //     string_field: 'test',
        //     int_field: 7,
        //     enum_field: 'A',
        //     string_array_field: ['B'],
        //     bool_field: true,
        // }
        return await Entity.findByIdAndUpdate({ _id: id }, entity, { new: true })
    }

    /* delete the entity with the given id */
    deleteEntity(id: string): void {
        const _id = mongoose.Types.ObjectId(id);
        Entity.findByIdAndDelete(_id);
    }
}

export default EntityService;