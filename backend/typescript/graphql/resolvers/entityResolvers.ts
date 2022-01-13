// file-storage {
import fs from "fs";
import { FileUpload } from "graphql-upload";
import { ReadStream } from "fs-capacitor";
import {
  validateFileType,
  getFileTypeValidationError,
} from "../../middlewares/validators/util";
// } file-storage
import EntityService from "../../services/implementations/EntityService";
// file-storage {
import FileStorageService from "../../services/implementations/fileStorageService";
// } file-storage
import {
  EntityRequestDTO,
  EntityResponseDTO,
} from "../../services/interfaces/IEntityService";
import { generateCSV } from "../../utilities/CSVUtils";

// no-file-storage {
const entityService = new EntityService();
// } no-file-storage
// file-storage {
const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
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
// } file-storage

const entityResolvers = {
  Query: {
    entity: async (_req: any, { id }: { id: string }) => {
      return entityService.getEntity(id);
    },
    entities: async () => {
      return entityService.getEntities();
    },
    entitiesCSV: async () => {
      const entities = await entityService.getEntities();
      const csv = await generateCSV<EntityResponseDTO>({ data: entities });
      return csv;
    },
    // file-storage {
    file: async (_req: any, { fileUUID }: { fileUUID: string }) => {
      return fileStorageService.getFile(fileUUID);
    },
    // } file-storage
  },
  Mutation: {
    createEntity: async (
      _req: any,
      // file-storage {
      { entity, file }: { entity: EntityRequestDTO; file: Promise<FileUpload> },
      // } file-storage
      // no-file-storage {
      { entity }: { entity: EntityRequestDTO },
      // } no-file-storage
    ) => {
      // file-storage {
      let filePath = "";
      let fileContentType = "";
      if (file) {
        const { createReadStream, mimetype, filename } = await file;
        const uploadDir = "uploads";
        filePath = `${uploadDir}/${filename}`;
        fileContentType = mimetype;
        if (!validateFileType(fileContentType)) {
          throw new Error(getFileTypeValidationError(fileContentType));
        }
        await writeFile(createReadStream(), filePath);
      }
      const newEntity = await entityService.createEntity({
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
      // } file-storage
      // no-file-storage {
      return entityService.createEntity({
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      });
      // } no-file-storage
    },
    updateEntity: async (
      _req: any,
      // file-storage {
      {
        id,
        entity,
        file,
      }: { id: string; entity: EntityRequestDTO; file: Promise<FileUpload> },
      // } file-storage
      // no-file-storage {
      { id, entity }: { id: string; entity: EntityRequestDTO },
      // } no-file-storage
    ) => {
      // file-storage {
      let filePath = "";
      let fileContentType = "";
      if (file) {
        const { createReadStream, mimetype, filename } = await file;
        const uploadDir = "uploads";
        filePath = `${uploadDir}/${filename}`;
        fileContentType = mimetype;
        if (!validateFileType(fileContentType)) {
          throw new Error(getFileTypeValidationError(fileContentType));
        }
        await writeFile(createReadStream(), filePath);
      }
      const updatedEntity = await entityService.updateEntity(id, {
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
      // } file-storage
      // no-file-storage {
      return entityService.updateEntity(id, {
        stringField: entity.stringField,
        intField: entity.intField,
        enumField: entity.enumField,
        stringArrayField: entity.stringArrayField,
        boolField: entity.boolField,
      });
      // } no-file-storage
    },
    deleteEntity: async (_req: any, { id }: { id: string }) => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
