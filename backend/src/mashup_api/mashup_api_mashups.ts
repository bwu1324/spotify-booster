import express from 'express';

import DatabaseInterface from '../database_interface/database_interface';
import Logger from '../logger/logger';

/**
 * createMashpesRouter() - Returns router for mashup part of mashup api
 * Handles adding/editing/deleting mashups
 * @param log - logger
 * @param db - database interface for mashups and tracks
 * @returns - Express router
 */
export default function createMashpesRouter(log: Logger, db: DatabaseInterface) {
  const router = express.Router();

  router.get('/mashupapi/getMashupName', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;

    try {
      const name = await db.getMashupName(mashup_id);
      res.status(200).send({ name });
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/mashupapi/setMashupName', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;
    const name = req.query.name as string;

    try {
      await db.setMashupName(mashup_id, name);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.post('/mashupapi/createMashup', async (req, res) => {
    const name = req.query.name as string;

    try {
      const mashup_id = await db.createMashup(name);
      res.status(200).send({ mashup_id });
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.delete('/mashupapi/deleteMashup', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;

    try {
      await db.deleteMashup(mashup_id);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  return router;
}
