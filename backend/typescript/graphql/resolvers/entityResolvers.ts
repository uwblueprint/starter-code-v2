import fs from "fs";
import { FileUpload } from "graphql-upload";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { ReadStream } from "fs-capacitor";
import multer from "multer";
import {
  validateFileType,
  getFileTypeValidationError,
} from "../../middlewares/validators/util";
import EntityService from "../../services/implementations/entityService";
import FileStorageService from "../../services/implementations/fileStorageService";
import {
  EntityRequestDTO,
  EntityResponseDTO,
} from "../../services/interfaces/IEntityService";
import { generateCSV } from "../../utilities/CSVUtils";

const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService = new FileStorageService(defaultBucket);
const entityService = new EntityService(fileStorageService);

multer({ dest: "uploads/" });

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
    entity: async (
      _req: undefined,
      { id }: { id: string },
    ): Promise<EntityResponseDTO> => {
      return entityService.getEntity(id);
    },
    entities: async (): Promise<EntityResponseDTO[]> => {
      return entityService.getEntities();
    },
    entitiesCSV: async (): Promise<string> => {
      const entities = await entityService.getEntities();
      const csv = await generateCSV<EntityResponseDTO>({ data: entities });
      return csv;
    },
    file: async (
      _req: undefined,
      { fileUUID }: { fileUUID: string },
    ): Promise<string> => {
      return fileStorageService.getFile(fileUUID);
    },
  },
  Mutation: {
    createEntity: async (
      _req: undefined,
      { entity, file }: { entity: EntityRequestDTO; file: Promise<FileUpload> },
    ): Promise<EntityResponseDTO> => {
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
    },
    updateEntity: async (
      _req: undefined,
      {
        id,
        entity,
        file,
      }: { id: string; entity: EntityRequestDTO; file: Promise<FileUpload> },
    ): Promise<EntityResponseDTO | null> => {
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
    },
    deleteEntity: async (
      _req: undefined,
      { id }: { id: string },
    ): Promise<string> => {
      return entityService.deleteEntity(id);
    },
  },
};

export default entityResolvers;
