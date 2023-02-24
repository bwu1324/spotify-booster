import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const DATABASE_PATH = process.env.DATABASE_PATH;

import DatabaseInterface from './database_interface';

const db = new DatabaseInterface(DATABASE_PATH);
