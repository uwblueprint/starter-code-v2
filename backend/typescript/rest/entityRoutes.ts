import express, { Router } from 'express';
import { Entity } from "../models/entity.mgmodel"
import EntityService from "../services/implementations/EntityService";
import { EntityRequestDTO } from "../services/interfaces/IEntityService";

export const entityRouter: Router = Router();
const entService = new EntityService();

/* Create entity Object */
entityRouter.post("/", async (_req, res) => {
    const entityObj: EntityRequestDTO = _req.body.entity;
    const IentityObj = {} as Entity;
    const entService = new EntityService();
    IentityObj.stringField = entityObj.stringField;
    IentityObj.intField = entityObj.intField;
    IentityObj.enumField = entityObj.enumField;
    IentityObj.stringArrayField = entityObj.stringArrayField;
    IentityObj.boolField = entityObj.boolField;

    try {
        await entService.createEntity(IentityObj);
        res.send('Success')
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});


/* Get all entity objects */
entityRouter.get("/", async (_req, res) => {
    try {
        const result = await entService.getEntities();
        res.send(result)
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

/* Get entity object by id */
entityRouter.get("/:id", async (_req, res) => {
    const id: string = _req.params.id;

    try {
        const result = await entService.getEntity(id);
        res.send(result)
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

/* Update entity object by id */
entityRouter.put("/:id", async (_req, res) => {
    const id: string = _req.params.id;
    const entityObj: EntityRequestDTO = _req.body.entity;

    const IentityObj = {} as Entity;
    IentityObj.stringField = entityObj.stringField;
    IentityObj.intField = entityObj.intField;
    IentityObj.enumField = entityObj.enumField;
    IentityObj.stringArrayField = entityObj.stringArrayField;
    IentityObj.boolField = entityObj.boolField;
    try {
        const result = await entService.updateEntity(id, IentityObj);
        res.send(result)
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

/* Delete entity object by id */
entityRouter.delete("/:id", async (_req, res) => {
    const id: string = _req.params.id;

    try {
        entService.deleteEntity(id);
        res.send('Success')
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = entityRouter
