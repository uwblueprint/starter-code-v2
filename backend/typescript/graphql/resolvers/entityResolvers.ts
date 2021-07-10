import fs from "fs";
import { FileUpload } from "graphql-upload";
import EntityService from "../../services/implementations/EntityServiceMg";
import FileStorageService from "../../services/implementations/storageService";
import { EntityRequestDTO } from "../../services/interfaces/IEntityService";

const defaultBucket = process.env.DEFAULT_BUCKET || "";
const fileStorageService = new FileStorageService(defaultBucket);
const entityService = new EntityService(fileStorageService);

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
      { entity, file }: { entity: EntityRequestDTO; file: FileUpload },
    ) => {
      let filePath = "";
      if (file) {
        const { createReadStream } = file;
        const uploadDir = "uploads";
        filePath = `${uploadDir}/${file.filename}`;
        createReadStream().pipe(fs.createWriteStream(filePath));
      }
      return entityService.createEntity({
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        filePath,
      });
    },
    updateEntity: async (
      _req: any,
      {
        id,
        entity,
        file,
      }: { id: string; entity: EntityRequestDTO; file: FileUpload },
    ) => {
      let filePath = "";
      if (file) {
        const { createReadStream } = file;
        const uploadDir = "uploads";
        filePath = `${uploadDir}/${file.filename}`;
        createReadStream().pipe(fs.createWriteStream(filePath));
      }
      return entityService.updateEntity(id, {
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        filePath,
      });
    },
    deleteEntity: async (_req: any, { id }: { id: string }) => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
