import express from 'express';

import DatabaseInterface from './database_interface';
import Logger from './logger';

const DATABASE_PATH = process.env.DATABASE_PATH;

export default function createRemixRouter(log: Logger): express.Router {
  const db = new DatabaseInterface(DATABASE_PATH);

  const router = express.Router();

  return router;
}
