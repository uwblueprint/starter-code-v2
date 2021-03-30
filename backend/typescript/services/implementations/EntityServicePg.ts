import PgEntity from "../../models/entity.pgmodel";
import { Entity } from "../../models/entity.mgmodel"
import {
    IEntityService,
    EntityRequestDTO,
    EntityResponseDTO,
} from "../interfaces/IEntityService";
import Logger from "../../utilities/logger";

interface entityPgModel {
    id: number;
    string_field: string;
    int_field: number;
    enum_field: string;
    string_array_field: [string];
    bool_field: boolean;

}

class EntityService implements IEntityService {
    /* eslint-disable class-methods-use-this */
    async getEntity(id: string): Promise<EntityResponseDTO> {
        let entity: any | null;
        try {
            entity = await PgEntity.findByPk(id);
            if (!entity) {
                throw new Error(`Entity id ${id} not found`);
            }
        } catch (error) {
            Logger.error(`Failed to get entity. Reason = ${error.message}`);
            throw error;
        }

        return {
            id: entity.id.toString(),
            stringField: entity.string_field,
            intField: entity.int_field,
            enumField: entity.enum_field,
            stringArrayField: entity.string_array_field,
            boolField: entity.bool_field,
        };
    }

    async getEntities(): Promise<EntityResponseDTO[]> {
        try {
            const entities: Array<any> = await PgEntity.findAll();
            return entities.map((entity) => ({
                id: entity.id,
                stringField: entity.string_field,
                intField: entity.int_field,
                enumField: entity.enum_field,
                stringArrayField: entity.string_array_field,
                boolField: entity.bool_field,
            }));
        } catch (error) {
            Logger.error(`Failed to get entities. Reason = ${error.message}`);
            throw error;
        }
    }

    async createEntity(entity: EntityRequestDTO): Promise<EntityResponseDTO> {
        let newEntity: any | null;
        try {
            newEntity = await PgEntity.create({
                string_field: entity.stringField,
                int_field: entity.intField,
                enum_field: entity.enumField,
                string_array_field: entity.stringArrayField,
                bool_field: entity.boolField
            });
        } catch (error) {
            Logger.error(`Failed to create entity. Reason = ${error.message}`);
            throw error;
        }
        return {
            id: newEntity.id,
            stringField: newEntity.string_field,
            intField: newEntity.int_field,
            enumField: newEntity.enum_field,
            stringArrayField: newEntity.string_array_field,
            boolField: newEntity.bool_field,
        };
    }

    async updateEntity(
        id: string,
        entity: EntityRequestDTO,
    ): Promise<EntityResponseDTO | null> {
        let updatedEntity: any | null;
        try {
            updatedEntity = await PgEntity.update({
                string_field: entity.stringField,
                int_field: entity.intField,
                enum_field: entity.enumField,
                string_array_field: entity.stringArrayField,
                bool_field: entity.boolField
            }, { where: { id: id } })
            if (!updatedEntity) {
                throw new Error(`Entity id ${id} not found`);
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
        };
    }

    async deleteEntity(id: string): Promise<void> {
        try {
            const deletedEntity: any
                | null = await PgEntity.destroy({ where: { id: id } });
            if (!deletedEntity) {
                throw new Error(`Entity id ${id} not found`);
            }
        } catch (error) {
            Logger.error(`Failed to delete entity. Reason = ${error.message}`);
            throw error;
        }
    }
}

export default EntityService;
