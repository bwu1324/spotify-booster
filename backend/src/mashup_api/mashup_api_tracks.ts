import express from 'express';

import DatabaseInterface from '../database_interface/database_interface';
import Logger from '../logger/logger';
import runMashupAPIFunction from './mashup_api_util';

/**
 * createTracksRouter() - Returns router for tracks part of mashup api
 * Handles adding/removing/fetching tracks
 * @param log - logger
 * @param db - database interface for mashups and tracks
 * @returns - Express router
 */
export default function createTracksRouter(log: Logger, db: DatabaseInterface) {
  const router = express.Router();

  router.get(
    '/mashupapi/getMashupTracks',
    runMashupAPIFunction(async (req) => {
      const mashup_id = req.query.mashup_id as string;

      const tracks = await db.getMashupTracks(mashup_id);
      return { tracks };
    })
  );

  router.put(
    '/mashupapi/addTrack',
    runMashupAPIFunction(async (req) => {
      const mashup_id = req.query.mashup_id as string;
      const track_id = req.query.track_id as string;

      await db.addTrack(mashup_id, track_id);
      return {};
    })
  );

  router.put(
    '/mashupapi/setStartMs',
    runMashupAPIFunction(async (req) => {
      const mashup_id = req.query.mashup_id as string;
      const track_id = req.query.track_id as string;
      const start_ms = parseInt(req.query.start_ms as string);

      await db.setStartMS(mashup_id, track_id, start_ms);
      return {};
    })
  );

  router.put(
    '/mashupapi/setEndMs',
    runMashupAPIFunction(async (req) => {
      const mashup_id = req.query.mashup_id as string;
      const track_id = req.query.track_id as string;
      const end_ms = parseInt(req.query.end_ms as string);

      await db.setEndMS(mashup_id, track_id, end_ms);
      return {};
    })
  );

  router.delete(
    '/mashupapi/removeTrack',
    runMashupAPIFunction(async (req) => {
      const mashup_id = req.query.mashup_id as string;
      const track_id = req.query.track_id as string;

      await db.removeTrack(mashup_id, track_id);
      return {};
    })
  );

  return router;
}
