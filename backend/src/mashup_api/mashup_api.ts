import express from 'express';
import cookieParser from 'cookie-parser';

import { database_config } from '../config/config';
import DatabaseInterface from '../database_interface/database_interface';
import Logger from '../logger/logger';
import createSpotifyAuthenticator from '../spotify_authentication/spotify_authentication';
import createMashupsRouter from './mashup_api_mashups';
import createTracksRouter from './mashup_api_tracks';

export default async function createMashupRouter(
  log: Logger
): Promise<{ db: DatabaseInterface; mashup_api: express.Router }> {
  const db = new DatabaseInterface(database_config.path);
  await db.ready;

  const mashup_api = express.Router();

  mashup_api.use('/mashupapi/', cookieParser());
  mashup_api.use('/mashupapi/', createSpotifyAuthenticator(log));
  mashup_api.use(createMashupsRouter(log, db));
  mashup_api.use(createTracksRouter(log, db));

  return { db, mashup_api };
}
