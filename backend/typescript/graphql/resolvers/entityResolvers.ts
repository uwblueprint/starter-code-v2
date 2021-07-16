import fs from "fs";
import { FileUpload } from "graphql-upload";
import EntityService from "../../services/implementations/EntityServiceMg";
import FileStorageService from "../../services/implementations/fileStorageService";
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
    file: async (_req: any, { fileUUID }: { fileUUID: string }) => {
      return fileStorageService.getFile(fileUUID);
    },
  },
  Mutation: {
    createEntity: async (
      _req: any,
      { entity, file }: { entity: EntityRequestDTO; file: Promise<FileUpload> },
    ) => {
      let filePath = "";
      let fileContentType = "";
      if (file) {
        const { createReadStream, mimetype, filename } = await file;
        const uploadDir = "uploads";
        filePath = `${uploadDir}/${filename}`;
        fileContentType = mimetype;
        createReadStream().pipe(fs.createWriteStream(filePath));
      }
      return entityService.createEntity({
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        filePath,
        fileContentType,
      });
    },
    updateEntity: async (
      _req: any,
      {
        id,
        entity,
        file,
      }: { id: string; entity: EntityRequestDTO; file: Promise<FileUpload> },
    ) => {
      let filePath = "";
      let fileContentType = "";
      if (file) {
        const { createReadStream, mimetype, filename } = await file;
        const uploadDir = "uploads";
        filePath = `${uploadDir}/${filename}`;
        fileContentType = mimetype;
        createReadStream().pipe(fs.createWriteStream(filePath));
      }
      return entityService.updateEntity(id, {
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        filePath,
        fileContentType,
      });
    },
    deleteEntity: async (_req: any, { id }: { id: string }) => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
