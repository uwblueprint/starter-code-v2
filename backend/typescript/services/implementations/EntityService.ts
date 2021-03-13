import { userInfo } from "node:os";
import { Entity, IEntity } from "../../models/entity.mgmodel";
import { IEntityService, EntityRequestDTO } from "../interfaces/IEntityService";
var mongoose = require('mongoose');


export class EntityService implements IEntityService {

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
