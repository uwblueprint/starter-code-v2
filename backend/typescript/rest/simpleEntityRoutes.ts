import { Router } from "express";
import { isAuthorizedByRole } from "../middlewares/auth";
import { simpleEntityRequestDtoValidator } from "../middlewares/validators/simpleEntityValidators";
import SimpleEntityService from "../services/implementations/simpleEntityService";
import {
  SimpleEntityResponseDTO,
  ISimpleEntityService,
} from "../services/interfaces/simpleEntityService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const simpleEntityRouter: Router = Router();
simpleEntityRouter.use(isAuthorizedByRole(new Set(["User", "Admin"])));

const simpleEntityService: ISimpleEntityService = new SimpleEntityService();

/* Create SimpleEntity */
simpleEntityRouter.post(
  "/",
  simpleEntityRequestDtoValidator,
  async (req, res) => {
    try {
      const { body } = req;
      const newEntity = await simpleEntityService.createEntity({
        stringField: body.stringField,
        intField: body.intField,
        enumField: body.enumField,
        stringArrayField: body.stringArrayField,
        boolField: body.boolField,
      });
      res.status(201).json(newEntity);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

/* Get all SimpleEntities */
simpleEntityRouter.get("/", async (req, res) => {
  const contentType = req.headers["content-type"];
  try {
    const entities = await simpleEntityService.getEntities();
    await sendResponseByMimeType<SimpleEntityResponseDTO>(
      res,
      200,
      contentType,
      entities,
    );
  } catch (e: unknown) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: getErrorMessage(e),
      },
    ]);
  }
});

/* Get SimpleEntity by id */
simpleEntityRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await simpleEntityService.getEntity(id);
    res.status(200).json(entity);
  } catch (e: unknown) {
    res.status(500).send(getErrorMessage(e));
  }
});

/* Update SimpleEntity by id */
simpleEntityRouter.put(
  "/:id",
  simpleEntityRequestDtoValidator,
  async (req, res) => {
    const { id } = req.params;
    try {
      const { body } = req;
      const entity = await simpleEntityService.updateEntity(id, {
        stringField: body.stringField,
        intField: body.intField,
        enumField: body.enumField,
        stringArrayField: body.stringArrayField,
        boolField: body.boolField,
      });
      res.status(200).json(entity);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  },
);

/* Delete SimpleEntity by id */
simpleEntityRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedId = await simpleEntityService.deleteEntity(id);
    res.status(200).json({ id: deletedId });
  } catch (e: unknown) {
    res.status(500).send(getErrorMessage(e));
  }
});

export default simpleEntityRouter;
