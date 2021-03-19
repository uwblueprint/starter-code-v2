import express, { Router } from 'express';
import { Entity } from "../models/entity.mgmodel"
import EntityService from "../services/implementations/EntityService";
import { EntityRequestDTO } from "../services/interfaces/IEntityService";

export const entityRouter: Router = Router();
const entService = new EntityService();

/* Create entity Object */
entityRouter.post("/", async (req, res) => {
    const entityObj: EntityRequestDTO = req.body.entity;
    try {
        const newEntity = await entService.createEntity(entityObj);
        res.status(200).json(newEntity);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});


/* Get all entity objects */
entityRouter.get("/", async (req, res) => {
    try {
        const entities = await entService.getEntities();
        res.status(200).json(entities);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

/* Get entity object by id */
entityRouter.get("/:id", async (req, res) => {
    const id: string = req.params.id;

    try {
        const entity = await entService.getEntity(id);
        res.status(200).json(entity);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

/* Update entity object by id */
entityRouter.put("/:id", async (req, res) => {
    const id: string = req.params.id;
    const entityObj: EntityRequestDTO = req.body.entity;
    try {
        const entity = await entService.updateEntity(id, entityObj);
        res.status(200).json(entity);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

/* Delete entity object by id */
entityRouter.delete("/:id", async (req, res) => {
    const id: string = req.params.id;

    try {
        entService.deleteEntity(id);
        res.send('Success');
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = entityRouter