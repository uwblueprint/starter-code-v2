import { Entity, IEntity } from "../../models/entity.mgmodel";

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

export interface IEntityService {
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