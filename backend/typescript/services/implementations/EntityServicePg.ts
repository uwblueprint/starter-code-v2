import { IEntityService, EntityRequestDTO, EntityResponseDTO } from "../interfaces/IEntityService";
import { Entity } from "../../models/entity.mgmodel";
import PgEntity from "../../models/entity.pgmodel";

export class PgEntityService implements IEntityService {
    async getEntity(id: string): Promise<EntityResponseDTO> {
        let entity: Entity | null;
        entity = await PgEntity.findById(id);

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
        let entityDtos: Array<EntityResponseDTO> = [];
        try {
            const entities: Array<Entity> = await PgEntity.find();
            entities.map((entity) => {
                let entityRequestDto = {
                    id: entity.id,
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

    async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
        let newEntity: Entity | null;
        try {
            newEntity = await PgEntity.create(entity);
        }
        catch (error) {
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
            updatedEntity = await PgEntity.findByIdAndUpdate({ _id: id }, entity, { new: true, runValidators: true });
            if (updatedEntity == null) {
                throw new Error(`Cannot update entity`);
            }
        }
        catch (error) {
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
        let deletedEntity: Entity | null = await PgEntity.findByIdAndDelete(id);

        if (!deletedEntity) {
            throw new Error(`Entity id ${id} not found.`);
        }
    }
}

export default PgEntityService;