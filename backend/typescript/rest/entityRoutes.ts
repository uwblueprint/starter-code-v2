import { Router } from 'express';
import { Entity } from "../models/entity.mgmodel"
import EntityServiceMg from "../services/implementations/EntityServiceMg";
import EntityServicePg from "../services/implementations/EntityServicePg";
import { EntityRequestDTO } from "../services/interfaces/IEntityService";

export const entityRouter: Router = Router();
const entService = new EntityServiceMg();
const entServicePg = new EntityServicePg();
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
  const entityObj: EntityRequestDTO = req.body.entity;
  try {
    const entity = await entService.updateEntity(id, entityObj);
    res.status(200).json(entity);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/* Delete entity object by id */
entityRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    entService.deleteEntity(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export default entityRouter;
