import express, { Router } from 'express';
import { Entity, IEntity } from "../models/entity.mgmodel"
import EntityService from "../services/EntityService";
import { EntityRequestDTO } from "../services/interfaces/IEntityService";

export const entityRouter: Router = Router();

/* Create entity Object */
entityRouter.post("/", async (_req, res) => {
    const entityObj: EntityRequestDTO = _req.body.entity;
    const IentityObj = {} as IEntity;
    const entService = new EntityService();
    IentityObj.string_field = entityObj.string_field;
    IentityObj.int_field = entityObj.int_field;
    IentityObj.enum_field = entityObj.enum_field;
    IentityObj.string_array_field = entityObj.string_array_field;
    IentityObj.bool_field = entityObj.bool_field;

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
    const entService = new EntityService();

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
    const entService = new EntityService();
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
    const entService = new EntityService();
    const id: string = _req.params.id;
    const entityObj: EntityRequestDTO = _req.body.entity;

    const IentityObj = {} as IEntity;
    IentityObj.string_field = entityObj.string_field;
    IentityObj.int_field = entityObj.int_field;
    IentityObj.enum_field = entityObj.enum_field;
    IentityObj.string_array_field = entityObj.string_array_field;
    IentityObj.bool_field = entityObj.bool_field;
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
    const entService = new EntityService();
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