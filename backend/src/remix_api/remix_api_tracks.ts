import express from 'express';

import DatabaseInterface from '../database_interface/database_interface';
import Logger from '../logger/logger';

/**
 * createTracksRouter() - Returns router for tracks part of remix api
 * Handles adding/removing/fetching tracks
 * @param log - logger
 * @param db - database interface for remixes and tracks
 * @returns - Express router
 */
export default function createTracksRouter(log: Logger, db: DatabaseInterface) {
  const router = express.Router();

  router.get('/remixapi/getRemixTracks', async (req, res) => {
    const remix_id = req.query.remix_id as string;

    try {
      const tracks = await db.getRemixTracks(remix_id);
      res.status(200).send({ tracks });
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/remixapi/addTrack', async (req, res) => {
    const remix_id = req.query.remix_id as string;
    const track_id = req.query.track_id as string;

    try {
      await db.addTrack(remix_id, track_id);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/remixapi/setStartMs', async (req, res) => {
    const remix_id = req.query.remix_id as string;
    const track_id = req.query.track_id as string;
    const start_ms = parseInt(req.query.start_ms as string);

    try {
      await db.setStartMS(remix_id, track_id, start_ms);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.put('/remixapi/setEndMs', async (req, res) => {
    const remix_id = req.query.remix_id as string;
    const track_id = req.query.track_id as string;
    const end_ms = parseInt(req.query.end_ms as string);

    try {
      await db.setEndMS(remix_id, track_id, end_ms);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  router.delete('/remixapi/removeTrack', async (req, res) => {
    const remix_id = req.query.remix_id as string;
    const track_id = req.query.track_id as string;

    try {
      await db.removeTrack(remix_id, track_id);
      res.status(200).send({});
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  });

  return router;
}
