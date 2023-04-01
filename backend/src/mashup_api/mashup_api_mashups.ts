import express from 'express';

import DatabaseInterface from '../database_interface/database_interface';
import Logger from '../logger/logger';
import { AuthRequest } from '../spotify_authentication/spotify_authentication';
import runMashupAPIFunction from './mashup_api_util';

/**
 * createMashpesRouter() - Returns router for mashup part of mashup api
 * Handles adding/editing/deleting mashups
 * @param log - logger
 * @param db - database interface for mashups and tracks
 * @returns - Express router
 */
export default function createMashpesRouter(log: Logger, db: DatabaseInterface) {
  const router = express.Router();

  router.get(
    '/mashupapi/getMashupName',
    runMashupAPIFunction(async (req: AuthRequest) => {
      const mashup_id = req.query.mashup_id as string;

      const name = await db.getMashupName(mashup_id);
      return { name };
    })
  );

  router.put(
    '/mashupapi/setMashupName',
    runMashupAPIFunction(async (req: AuthRequest) => {
      const mashup_id = req.query.mashup_id as string;
      const name = req.query.name as string;

      await db.setMashupName(mashup_id, name);
      return {};
    })
  );

  router.post(
    '/mashupapi/createMashup',
    runMashupAPIFunction(async (req: AuthRequest) => {
      const name = req.query.name as string;

      const mashup_id = await db.createMashup(name, req.spotify_uid);
      return { mashup_id };
    })
  );

  router.delete(
    '/mashupapi/deleteMashup',
    runMashupAPIFunction(async (req: AuthRequest) => {
      const mashup_id = req.query.mashup_id as string;

      await db.deleteMashup(mashup_id);
      return {};
    })
  );

  return router;
}
