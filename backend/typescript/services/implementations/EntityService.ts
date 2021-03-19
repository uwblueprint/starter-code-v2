import MgEntity, { Entity } from "../../models/entity.mgmodel";
import { IEntityService, EntityRequestDTO } from "../interfaces/IEntityService";


export class EntityService implements IEntityService {

    async getEntity(id: string): Promise<EntityRequestDTO> {
        let entity: Entity | null;
        entity = await MgEntity.findById(id);

        if (!entity) {
            throw new Error(`Entity id ${id} not found.`);
        }
        return {
            stringField: entity.stringField,
            intField: entity.intField,
            enumField: entity.enumField,
            stringArrayField: entity.stringArrayField,
            boolField: entity.boolField,
        };
    }

    async getEntities(): Promise<EntityRequestDTO[]> {
        let entityDtos: Array<EntityRequestDTO> = [];
        try {
            const entities: Array<Entity> = await MgEntity.find();
            entities.map((entity) => {
                let entityRequestDto = {
                    stringField: entity.stringField,
                    intField: entity.intField,
                    enumField: entity.enumField,
                    stringArrayField: entity.stringArrayField,
                    boolField: entity.boolField,
                }
                entityDtos.push(entityRequestDto)
            })

        } catch (e) {
            throw new Error(`entities not found`);
        }
        return entityDtos;
    }

    async createEntity(entity: EntityRequestDTO): Promise<EntityRequestDTO> {
        let newEntity: Entity | null;
        try {
            newEntity = await MgEntity.create(entity);
        }
        catch (error) {
            throw new Error(`Cannot create entity`);
        }
        return {
            stringField: newEntity.stringField,
            intField: newEntity.intField,
            enumField: newEntity.enumField,
            stringArrayField: newEntity.stringArrayField,
            boolField: newEntity.boolField,

        };
    }
    async updateEntity(id: string, entity: EntityRequestDTO): Promise<EntityRequestDTO | null> {
        let updatedEntity: Entity | null;
        try {
            updatedEntity = await MgEntity.findByIdAndUpdate({ _id: id }, entity, { new: true, runValidators: true });
            if (updatedEntity == null) {
                throw new Error(`Cannot update entity`);
            }
        }
        catch (error) {
            throw error;
        }
        return {
            stringField: updatedEntity.stringField,
            intField: updatedEntity.intField,
            enumField: updatedEntity.enumField,
            stringArrayField: updatedEntity.stringArrayField,
            boolField: updatedEntity.boolField,
        };
    }

    async deleteEntity(id: string): Promise<void> {
        let deletedEntity: Entity | null = await MgEntity.findByIdAndDelete(id);

        if (!deletedEntity) {
            throw new Error(`Entity id ${id} not found.`);
        }
    }
}

export default EntityService;
