import SimpleEntityService from "../../services/implementations/simpleEntityService";
import {
  SimpleEntityRequestDTO,
  SimpleEntityResponseDTO,
} from "../../services/interfaces/simpleEntityService";
import { generateCSV } from "../../utilities/CSVUtils";

const simpleEntityService = new SimpleEntityService();

const entityResolvers = {
  Query: {
    entity: async (
      _req: undefined,
      { id }: { id: string },
    ): Promise<SimpleEntityResponseDTO> => {
      return simpleEntityService.getEntity(id);
    },
    entities: async (): Promise<SimpleEntityResponseDTO[]> => {
      return simpleEntityService.getEntities();
    },
    entitiesCSV: async (): Promise<string> => {
      const entities = await simpleEntityService.getEntities();
      const csv = await generateCSV<SimpleEntityResponseDTO>({
        data: entities,
      });
      return csv;
    },
  },
  Mutation: {
    createEntity: async (
      _req: undefined,
      { entity }: { entity: SimpleEntityRequestDTO },
    ): Promise<SimpleEntityResponseDTO> => {
      return simpleEntityService.createEntity({
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      });
    },
    updateEntity: async (
      _req: undefined,
      { id, entity }: { id: string; entity: SimpleEntityRequestDTO },
    ): Promise<SimpleEntityResponseDTO | null> => {
      return simpleEntityService.updateEntity(id, {
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      });
    },
    deleteEntity: async (
      _req: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return simpleEntityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
