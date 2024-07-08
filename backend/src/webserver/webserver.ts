import express from 'express';
import http from 'http';
import path from 'path';
import axios from 'axios';

import { env_config, spotify_api_config, web_server_config } from '../config/config';
import Logger from '../logger/logger';
import createWebLogger from './web_logger';
import createMashupRouter from '../mashup_api/mashup_api';
import { CORS } from './cors_import';

/**
 * createHTTPSever() - Creates a http/https webserver using the environment configuration
 * @param log - logger
 * @returns - webserver
 */
function createHTTPServer(log: Logger) {
  const http_server = http.createServer();

  http_server.listen(web_server_config.port);
  http_server.on('listening', () => {
    log.info(`Webserver listening on port: ${web_server_config.port}`);
  });
  return http_server;
}

/**
 * createExpressApp() - Creates an express web app and loads routers and extensions
 * @param webserver - http/https webserver express should listen on
 * @param log - logger
 * @returns express webserver
 */
async function createExpressApp(webserver: http.Server, log: Logger) {
  const { db, mashup_api } = await createMashupRouter(log);
  const { webLogError, webLogger } = createWebLogger(log);

  const app = express();
  if (env_config.in_dev_env) {
    log.info('Enabling Cross-Origin Resource Sharing (CORS)');
    app.use(CORS);
  }

  app.use(express.static(web_server_config.static_path)); // setup static directory for webapp
  app.use(webLogger);
  app.use(mashup_api);

  // serve homepage
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(web_server_config.index_path));
  });

  app.get('/login', (req, res) => {
    const login_url = `https://accounts.spotify.com/authorize?client_id=${
      spotify_api_config.client_id
    }&response_type=code&redirect_uri=${spotify_api_config.redirect_url}&scope=${
      spotify_api_config.scopes
    }&state=${Math.random().toString(36).substring(7)}`;

    res.redirect(login_url);
  });

  app.get('/callback', async (req, res) => {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    };
    const body = {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: spotify_api_config.redirect_url,
      client_id: spotify_api_config.client_id,
      client_secret: spotify_api_config.client_secret,
    };

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', body, {
        headers,
      });

      const data = response.data as { access_token?: string };
      if (data && data.access_token) {
        res.cookie('spotify_access_token', data.access_token);
        res.redirect('/');
      } else {
        res.status(403).send();
      }
    } catch (error) {
      log.error('Failed to exchange code for access token.', error);
      res.status(500).send();
    }
  });

  app.use(webLogError); // must go at the end to make sure errors are handled

  webserver.on('request', app);

  webserver.on('close', async () => {
    log.info('Closing webserver and database');
    await db.close();
  });
  return webserver;
}

/**
 * StartWebServer() - Starts the webserver
 * @returns express webserver
 */
export default function StartWebServer() {
  const logger = new Logger('Webserver');
  const webserver = createHTTPServer(logger);
  return createExpressApp(webserver, logger);
}
