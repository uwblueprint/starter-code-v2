import { Router } from "express";
// file-storage {
import fs from "fs";
import multer from "multer";
// } file-storage
// auth {
import { isAuthorizedByRole } from "../middlewares/auth";
// } auth
import { entityRequestDtoValidator } from "../middlewares/validators/entityValidators";
import EntityService from "../services/implementations/entityService";
// file-storage {
import FileStorageService from "../services/implementations/fileStorageService";
import IFileStorageService from "../services/interfaces/fileStorageService";
// } file-storage
import {
  EntityResponseDTO,
  IEntityService,
} from "../services/interfaces/IEntityService";
import { sendResponseByMimeType } from "../utilities/responseUtil";

// file-storage {
const upload = multer({ dest: "uploads/" });

// } file-storage
const entityRouter: Router = Router();
// auth {
entityRouter.use(isAuthorizedByRole(new Set(["User", "Admin"])));
// } auth

// no-file-storage {
const entityService: IEntityService = new EntityService();
// } no-file-storage
// file-storage {
const defaultBucket = process.env.DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);
const entityService: IEntityService = new EntityService(fileStorageService);
// } file-storage

/* Create entity */
entityRouter.post(
  "/",
  // file-storage {
  upload.single("file"),
  // } file-storage
  entityRequestDtoValidator,
  async (req, res) => {
    try {
      // file-storage {
      const body = JSON.parse(req.body.body);
      // } file-storage
      // no-file-storage {
      const body = req.body;
      // } no-file-storage
      const newEntity = await entityService.createEntity({
        stringField: body.stringField,
        intField: body.intField,
        enumField: body.enumField,
        stringArrayField: body.stringArrayField,
        boolField: body.boolField,
        // file-storage {
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
        // } file-storage
      });
      // file-storage {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      // } file-storage
      res.status(201).json(newEntity);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
);

/* Get all entities */
entityRouter.get("/", async (req, res) => {
  const contentType = req.headers["content-type"];
  try {
    const entities = await entityService.getEntities();
    await sendResponseByMimeType<EntityResponseDTO>(
      res,
      200,
      contentType,
      entities,
    );
  } catch (e) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: e.message,
      },
    ]);
  }
});

/* Get entity by id */
entityRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await entityService.getEntity(id);
    res.status(200).json(entity);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Update entity by id */
entityRouter.put(
  "/:id",
  // file-storage {
  upload.single("file"),
  // } file-storage
  entityRequestDtoValidator,
  async (req, res) => {
    const { id } = req.params;
    try {
      // file-storage {
      const body = JSON.parse(req.body.body);
      // } file-storage
      // no-file-storage {
      const body = req.body;
      // } no-file-storage
      const entity = await entityService.updateEntity(id, {
        stringField: body.stringField,
        intField: body.intField,
        enumField: body.enumField,
        stringArrayField: body.stringArrayField,
        boolField: body.boolField,
        // file-storage {
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
        // } file-storage
      });
      // file-storage {
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      // } file-storage
      res.status(200).json(entity);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
);

/* Delete entity by id */
entityRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await entityService.deleteEntity(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// file-storage {
/* Get file associated with entity by fileUUID */
entityRouter.get("/files/:fileUUID", async (req, res) => {
  const { fileUUID } = req.params;
  try {
    const fileURL = await fileStorageService.getFile(fileUUID);
    res.status(200).json({ fileURL });
  } catch (e) {
    res.status(500).send(e.message);
  }
});
// } file-storage

export default entityRouter;
