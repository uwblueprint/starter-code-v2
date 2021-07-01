import { Router } from "express";
import EntityService from "../services/implementations/entityService";
// auth {
import { isAuthorizedByRole } from "../middlewares/auth";
// } auth
import { IEntityService } from "../services/interfaces/IEntityService";
import { entityRequestDtoValidator } from "../middlewares/validators/entityValidators";

const entityRouter: Router = Router();
// auth {
entityRouter.use(isAuthorizedByRole(new Set(["User", "Admin"])));
// } auth

const entityService: IEntityService = new EntityService();

/* Create entity */
entityRouter.post("/", entityRequestDtoValidator, async (req, res) => {
  try {
    const newEntity = await entityService.createEntity({
      stringField: req.body.stringField,
      intField: req.body.intField,
      enumField: req.body.enumField,
      stringArrayField: req.body.stringArrayField,
      boolField: req.body.boolField,
    });
    res.status(201).json(newEntity);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

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
