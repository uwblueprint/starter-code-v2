import { Router } from "express";
import EntityServiceMg from "../services/implementations/EntityServiceMg";
import EntityServicePg from "../services/implementations/EntityServicePg";

const entityRouter: Router = Router();
const entService = new EntityServicePg();

/* Create entity Object */
entityRouter.post("/", async (req, res) => {
  try {
    const newEntity = await entService.createEntity({
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

/* Get all entity objects */
entityRouter.get("/", async (req, res) => {
  try {
    const entities = await entService.getEntities();
    res.status(200).json(entities);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Get entity object by id */
entityRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await entService.getEntity(id);
    res.status(200).json(entity);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Update entity object by id */
entityRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const entity = await entService.updateEntity(id, {
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

/* Delete entity object by id */
entityRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await entService.deleteEntity(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default entityRouter;
