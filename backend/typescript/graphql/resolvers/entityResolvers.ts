import fs from "fs";
import { FileUpload } from "graphql-upload";
import { ReadStream } from "fs-capacitor";
import EntityService from "../../services/implementations/EntityServiceMg";
import FileStorageService from "../../services/implementations/fileStorageService";
import { EntityRequestDTO } from "../../services/interfaces/IEntityService";

const defaultBucket = process.env.DEFAULT_BUCKET || "";
const fileStorageService = new FileStorageService(defaultBucket);
const entityService = new EntityService(fileStorageService);

const writeFile = (readStream: ReadStream, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(filePath);
    readStream.pipe(out);
    out.on("finish", () => {
      resolve();
    });
    out.on("error", (err) => reject(err));
  });
};

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
        await writeFile(createReadStream(), filePath);
      }
      const newEntity = entityService.createEntity({
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        filePath,
        fileContentType,
      });
      if (filePath) {
        fs.unlinkSync(filePath);
      }
      return newEntity;
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
        await writeFile(createReadStream(), filePath);
      }
      const updatedEntity = entityService.updateEntity(id, {
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
        filePath,
        fileContentType,
      });
      if (filePath) {
        fs.unlinkSync(filePath);
      }
      return updatedEntity;
    },
    deleteEntity: async (_req: any, { id }: { id: string }) => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
