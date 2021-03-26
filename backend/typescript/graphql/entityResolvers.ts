import EntityService from "../services/implementations/EntityService";
import { EntityRequestDTO } from "../services/interfaces/IEntityService";

const entityService = new EntityService();

const entityResolvers = {
  Query: {
    entity: async (_req: any, { id }: { id: string }) => {
      console.log(id);
      return entityService.getEntity(id);
    },
    entities: async () => {
      return entityService.getEntities();
    },
  },
  Mutation: {
    createEntity: async (_req: any, obj: EntityRequestDTO) => {
      return entityService.createEntity({
        stringField: obj.stringField,
        intField: obj.intField,
        enumField: obj.enumField,
        stringArrayField: obj.stringArrayField,
        boolField: obj.boolField,
      });
    },
    updateEntity: async (
      _req: any,
      { id, obj }: { id: string; obj: EntityRequestDTO },
    ) => {
      return entityService.updateEntity(id, {
        stringField: obj.stringField,
        intField: obj.intField,
        enumField: obj.enumField,
        stringArrayField: obj.stringArrayField,
        boolField: obj.boolField,
      });
    },
    deleteEntity: async (_req: any, { id }: { id: string }) => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
