import express from 'express';

import DatabaseInterface from '../database_interface/database_interface';
import Logger from '../logger/logger';

/**
 * createTracksRouter() - Returns router for tracks part of mashup api
 * Handles adding/removing/fetching tracks
 * @param log - logger
 * @param db - database interface for mashups and tracks
 * @returns - Express router
 */
export default function createTracksRouter(log: Logger, db: DatabaseInterface) {
  const router = express.Router();

  router.get('/mashupapi/getMashupTracks', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;

    try {
      const tracks = await db.getMashupTracks(mashup_id);
      res.status(200).send({ tracks });
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/mashupapi/addTrack', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;
    const track_id = req.query.track_id as string;

    try {
      await db.addTrack(mashup_id, track_id);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/mashupapi/setStartMs', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;
    const track_id = req.query.track_id as string;
    const start_ms = parseInt(req.query.start_ms as string);

    try {
      await db.setStartMS(mashup_id, track_id, start_ms);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/mashupapi/setEndMs', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;
    const track_id = req.query.track_id as string;
    const end_ms = parseInt(req.query.end_ms as string);

    try {
      await db.setEndMS(mashup_id, track_id, end_ms);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.delete('/mashupapi/removeTrack', async (req, res) => {
    const mashup_id = req.query.mashup_id as string;
    const track_id = req.query.track_id as string;

    try {
      await db.removeTrack(mashup_id, track_id);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  return router;
}
