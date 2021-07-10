import { Router } from "express";
import multer from "multer";
// import EntityServiceMg from "../services/implementations/EntityServiceMg";
import EntityServicePg from "../services/implementations/EntityServicePg";
import { isAuthorizedByRole } from "../middlewares/auth";
import { IEntityService } from "../services/interfaces/IEntityService";
import { entityRequestDtoValidator } from "../middlewares/validators/entityValidators";
import IFileStorageService from "../services/interfaces/storageService";
import FileStorageService from "../services/implementations/storageService";

const upload = multer({ dest: "uploads/" });

const entityRouter: Router = Router();
entityRouter.use(isAuthorizedByRole(new Set(["User", "Admin"])));

const defaultBucket = process.env.DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(
  defaultBucket,
);
const entityService: IEntityService = new EntityServicePg(fileStorageService);

/* Create entity */
entityRouter.post(
  "/",
  upload.single("file"),
  entityRequestDtoValidator,
  async (req, res) => {
    try {
      const newEntity = await entityService.createEntity({
        stringField: req.body.stringField,
        intField: req.body.intField,
        enumField: req.body.enumField,
        stringArrayField: req.body.stringArrayField,
        boolField: req.body.boolField,
        filePath: req.file?.path,
      });
      res.status(201).json(newEntity);
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
);

/* Get all entities */
entityRouter.get("/", async (_req, res) => {
  try {
    const entities = await entityService.getEntities();
    res.status(200).json(entities);
  } catch (e) {
    res.status(500).send(e.message);
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
entityRouter.put("/:id", entityRequestDtoValidator, async (req, res) => {
  const { id } = req.params;
  try {
    const entity = await entityService.updateEntity(id, {
      stringField: req.body.stringField,
      intField: req.body.intField,
      enumField: req.body.enumField,
      stringArrayField: req.body.stringArrayField,
      boolField: req.body.boolField,
      filePath: req.body.filePath,
    });
    res.status(200).json(entity);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

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

export default entityRouter;
