import { errorMonitor } from "node:events";
import { MEntity, Entity } from "../../models/entity.mgmodel";
import { IEntityService, EntityRequestDTO } from "../interfaces/IEntityService";


export class EntityService implements IEntityService {

    async getEntity(id: string): Promise<Entity> {
        let entity: Entity | null;
        entity = await MEntity.findById(id);

        if (!entity) {
            throw new Error(`Entity id ${id} not found.`);
        }
        return entity;
    }

    async getEntities(): Promise<Entity[]> {
        return await MEntity.find();
    }

    async createEntity(entity: Entity): Promise<Entity> {
        try {
            const newEntity: Entity | null = await MEntity.create(entity);
            return newEntity;
        }
        catch (e) {
            throw Error;
        }
    }
    async updateEntity(id: string, entity: Entity): Promise<Entity | null> {
        try {
            const updatedEntity: Entity | null = await MEntity.findByIdAndUpdate({ _id: id }, entity, { new: true, runValidators: true })
            return updatedEntity;
        }
        catch (e) {
            throw Error;
        }
    }

    async deleteEntity(id: string): Promise<void> {
        try {
            await MEntity.findByIdAndDelete(id);
        }
        catch (e) {
            throw Error;
        }
    }
}

export default EntityService;
