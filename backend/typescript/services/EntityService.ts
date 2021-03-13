import { userInfo } from "node:os";
import { Entity, IEntity } from "../models/entity.mgmodel"
var mongoose = require('mongoose');
enum Options {
    A, B, C, D,
}

export interface EntityRequestDTO {
    string_field: string;
    int_field: number;
    enum_field: string;
    string_array_field: [string];
    bool_field: boolean;
}

export interface EntityService {
    /* retrieve the Entity with the given id */
    getEntity(id: string): Promise<IEntity>
    /* retrieve all Entities (pagination is nice-to-have future feature) */
    getEntities(): Promise<IEntity[]>
    /* create an Entity with the fields given in the DTO, return created Entity */
    createEntity(entity: IEntity): Promise<IEntity>;
    /* update the Entity with the given id with fields in the DTO, return updated Entity */
    updateEntity(id: string, entity: IEntity): Promise<IEntity | null>;
    /* delete the entity with the given id */
    deleteEntity(id: string): void;
}

export class EntityService {

    /* retrieve the Entity with the given id */
    async getEntity(id: string): Promise<IEntity> {
        let entity: IEntity | null;
        entity = await Entity.findById(mongoose.Types.ObjectId(id));

        if (!entity) {
            throw new Error;
        }
        return entity;
    }

    /* retrieve all Entities (pagination is nice-to-have future feature) */
    async getEntities(): Promise<IEntity[]> {
        return await Entity.find();
    }

    /* create an Entity with the fields given in the DTO, return created Entity */
    async createEntity(entity: IEntity): Promise<IEntity> {
        return await Entity.create(entity);
    }
    /* update the Entity with the given id with fields in the DTO, return updated Entity */
    async updateEntity(id: string, entity: IEntity): Promise<IEntity | null> {
        return await Entity.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(id) }, entity, { new: true })
    }

    /* delete the entity with the given id */
    async deleteEntity(id: string): Promise<void> {
        await Entity.findByIdAndDelete(mongoose.Types.ObjectId(id));
    }
}

export default EntityService;