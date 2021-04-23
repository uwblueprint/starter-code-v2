import EntityService from "../../services/implementations/EntityServiceMg";
import { EntityRequestDTO } from "../../services/interfaces/IEntityService";

const entityService = new EntityService();

const entityResolvers = {
  Query: {
    entity: async (_req: any, { id }: { id: string }) => {
      return entityService.getEntity(id);
    },
    entities: async () => {
      return entityService.getEntities();
    },
  },
  Mutation: {
    createEntity: async (
      _req: any,
      { entity }: { entity: EntityRequestDTO },
    ) => {
      return entityService.createEntity({
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      });
    },
    updateEntity: async (
      _req: any,
      { id, entity }: { id: string; entity: EntityRequestDTO },
    ) => {
      return entityService.updateEntity(id, {
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      });
    },
    deleteEntity: async (_req: any, { id }: { id: string }) => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
