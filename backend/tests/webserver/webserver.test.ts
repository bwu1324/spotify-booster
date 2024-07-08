import { assert } from 'chai';
import request from 'supertest';
import path from 'path';
import sinon from 'sinon';
import express from 'express';

import * as createMashupRouter from '../../src/mashup_api/mashup_api';
import * as cors from '../../src/webserver/cors_import';

import StartWebServer from '../../src/webserver/webserver';
import { createDirectory, removeDirectory } from '../test_utils/hooks/create_test_directory.test';
import { stubLogger } from '../test_utils/stubs/stub_logger.test';
import stubConfig from '../test_utils/stubs/stub_config.test';
import {
  createIndexFile,
  createStaticFiles,
  test_index_file,
  test_static_file0,
  test_static_file1,
} from './webserver_utils.test';
import uniqueID from '../test_utils/unique_id.test';
import axios from 'axios';

const TEST_DIRECTORY = path.join(__dirname, 'test_web_server');
const WEB_INDEX_PATH = path.join(TEST_DIRECTORY, 'index.html');
const WEB_STATIC_PATH = path.join(TEST_DIRECTORY, 'static');

const WEB_PORT = 8888;
const TEST_URL = 'http://localhost:8888';

const TEST_CLIENT_ID = 'some_id';
const TEST_CLIENT_SECRET = 'very_secret_secret';
const TEST_REDIRECT_URL = 'http://redirect.url';
const TEST_SCOPES = 'test scopes';

describe('Web Server', () => {
  before(() => {
    createDirectory(TEST_DIRECTORY);
    createIndexFile(WEB_INDEX_PATH);
    createStaticFiles(WEB_STATIC_PATH);
  });

  beforeEach(function () {
    this.logger_stub = stubLogger();
    stubConfig({
      web_server_config: {
        port: WEB_PORT,
        static_path: WEB_STATIC_PATH,
        index_path: WEB_INDEX_PATH,
      },
      database_config: {
        path: path.join(TEST_DIRECTORY, uniqueID()),
      },
      spotify_api_config: {
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,
        redirect_url: TEST_REDIRECT_URL,
        scopes: TEST_SCOPES,
      },
    });
  });

  after(() => {
    removeDirectory(TEST_DIRECTORY);
  });

  describe('Basic Web Server', () => {
    beforeEach(async function () {
      this.server = await StartWebServer();
    });

    afterEach(function (done) {
      this.server.close(() => done());
    });

    it('returns index page at /', async () => {
      const req = request(TEST_URL);
      const response = await req.get('/');

      assert.equal(response.text, test_index_file, 'Responds with correct index file');
    });

    it('redirects to spoitfy login at /login', async () => {
      const req = request(TEST_URL);
      const response = await req.get('/login');

      const url = new URL(response.header.location);
      assert.equal(url.origin, 'https://accounts.spotify.com', 'Calls correct host');
      assert.equal(url.pathname, '/authorize', 'Calls correct path');
      assert.equal(url.searchParams.get('client_id'), TEST_CLIENT_ID, 'Uses correct client_id');
      assert.equal(url.searchParams.get('response_type'), 'code', 'Uses correct response_type');
      assert.equal(url.searchParams.get('redirect_uri'), TEST_REDIRECT_URL, 'Uses correct redirect_url');
      assert.equal(url.searchParams.get('scope'), TEST_SCOPES, 'Uses correct scopes');
    });

    it('successfully successfully exchanges token with spotify with valid code supplied at /callback', async () => {
      let stub_url: string;
      let stub_headers: any;
      let stub_body: any;
      sinon.stub(axios, 'post').callsFake(async (url: string, body: any, options: any) => {
        stub_url = url;
        stub_headers = options.headers;
        stub_body = body;

        if (body.code === 'valid') return { data: { access_token: 'some_token' } };
        if (body.code === 'error') throw new Error('Something went wrong');
        return {};
      });

      const req = request(TEST_URL);
      const response = await req.get('/callback?code=valid');

      assert.notEqual(
        response.header['set-cookie'][0].indexOf('spotify_access_token=some_token'),
        -1,
        'Does not set spotify_access_token cookie.'
      );
      assert.equal(response.header.location, '/', 'Redirects to index page');

      assert.equal(stub_url, 'https://accounts.spotify.com/api/token', 'Calls correct spotify url');

      assert.equal(stub_headers['Content-Type'], 'application/x-www-form-urlencoded', 'Uses correct Content-Type header');
      assert.equal(stub_headers['Accept'], 'application/json', 'Uses correct Accept header');

      assert.equal(stub_body.grant_type, 'authorization_code', 'Uses correct grant_type');
      assert.equal(stub_body.redirect_uri, TEST_REDIRECT_URL, 'Uses redirect_uri');
      assert.equal(stub_body.client_id, TEST_CLIENT_ID, 'Uses correct client_id');
      assert.equal(stub_body.client_secret, TEST_CLIENT_SECRET, 'Uses correct client_secret');
    });

    it('returns error when exchanging token with spotify errors at /callback', async () => {
      let stub_url: string;
      let stub_headers: any;
      let stub_body: any;
      sinon.stub(axios, 'post').callsFake(async (url: string, body: any, options: any) => {
        stub_url = url;
        stub_headers = options.headers;
        stub_body = body;

        if (body.code === 'valid') return { data: { access_token: 'some_token' } };
        if (body.code === 'error') throw new Error('Something went wrong');
        return {};
      });

      const req = request(TEST_URL);
      const response = await req.get('/callback?code=error');

      if (response.header['set-cookie'] && response.header['set-cookie'].length > 0) {
        assert.equal(
          response.header['set-cookie'][0].indexOf('spotify_access_token=some_token'),
          -1,
          'Does not set spotify_access_token cookie.'
        );
      }
      assert.equal(response.status, 500, 'Responds with server error');

      assert.equal(stub_url, 'https://accounts.spotify.com/api/token', 'Calls correct spotify url');

      assert.equal(stub_headers['Content-Type'], 'application/x-www-form-urlencoded', 'Uses correct Content-Type header');
      assert.equal(stub_headers['Accept'], 'application/json', 'Uses correct Accept header');

      assert.equal(stub_body.grant_type, 'authorization_code', 'Uses correct grant_type');
      assert.equal(stub_body.redirect_uri, TEST_REDIRECT_URL, 'Uses redirect_uri');
      assert.equal(stub_body.client_id, TEST_CLIENT_ID, 'Uses correct client_id');
      assert.equal(stub_body.client_secret, TEST_CLIENT_SECRET, 'Uses correct client_secret');
    });

    it('returns unauthenticated when exchanging token with spotify with invalid code supplied at /callback', async () => {
      let stub_url: string;
      let stub_headers: any;
      let stub_body: any;
      sinon.stub(axios, 'post').callsFake(async (url: string, body: any, options: any) => {
        stub_url = url;
        stub_headers = options.headers;
        stub_body = body;

        if (body.code === 'valid') return { data: { access_token: 'some_token' } };
        if (body.code === 'error') throw new Error('Something went wrong');
        return {};
      });

      const req = request(TEST_URL);
      const response = await req.get('/callback?code=invalid');

      if (response.header['set-cookie'] && response.header['set-cookie'].length > 0) {
        assert.equal(
          response.header['set-cookie'][0].indexOf('spotify_access_token=some_token'),
          -1,
          'Does not set spotify_access_token cookie.'
        );
      }
      assert.equal(response.status, 403, 'Responds with unauthenticated error');

      assert.equal(stub_url, 'https://accounts.spotify.com/api/token', 'Calls correct spotify url');

      assert.equal(stub_headers['Content-Type'], 'application/x-www-form-urlencoded', 'Uses correct Content-Type header');
      assert.equal(stub_headers['Accept'], 'application/json', 'Uses correct Accept header');

      assert.equal(stub_body.grant_type, 'authorization_code', 'Uses correct grant_type');
      assert.equal(stub_body.redirect_uri, TEST_REDIRECT_URL, 'Uses redirect_uri');
      assert.equal(stub_body.client_id, TEST_CLIENT_ID, 'Uses correct client_id');
      assert.equal(stub_body.client_secret, TEST_CLIENT_SECRET, 'Uses correct client_secret');
    });

    it('returns static content at /test_static0.js', async () => {
      const req = request(TEST_URL);
      const response = await req.get('/test_static0.js');

      assert.equal(response.text, test_static_file0, 'Responds with correct static file');
    });

    it('returns static content in a subfolder at /subfolder/test_static1.js', async () => {
      const req = request(TEST_URL);
      const response = await req.get('/subfolder/test_static1.js');

      assert.equal(response.text, test_static_file1, 'Responds with correct static file');
    });
  });

  describe('Web Logger', () => {
    it('logs error when express encounters an error', async function () {
      sinon.stub(createMashupRouter, 'default').callsFake(async () => {
        const mashup_api = express.Router();
        mashup_api.get('/error', () => {
          throw new Error('Some Error');
        });
        return { mashup_api, db: undefined };
      });

      const server = await StartWebServer();

      const req = request(TEST_URL);
      await req.get('/error');

      assert.equal(this.logger_stub.error.callCount, 1, 'Calls error logger once');
      assert.throws(() => {
        throw this.logger_stub.error.getCall(0).args[1];
      }, 'Some Error');

      return new Promise((resolve) => {
        server.close(() => resolve());
      });
    });
  });

  describe('Allow/Reject CORS', () => {
    it('calls CORS middleware when in dev environment', async () => {
      const spy = sinon.spy(cors, 'CORS');

      stubConfig({
        env_config: {
          in_dev_env: true,
        },
      });
      const server = await StartWebServer();

      const req = request(TEST_URL);
      await req.get('/index');

      assert.equal(spy.callCount, 1, 'Calls CORS Middleware');

      return new Promise((resolve) => {
        server.close(() => resolve());
      });
    });

    it('does not call CORS middleware when in non dev environment', async () => {
      const spy = sinon.spy(cors, 'CORS');

      stubConfig({
        env_config: {
          in_dev_env: false,
        },
      });
      const server = await StartWebServer();

      const req = request(TEST_URL);
      await req.get('/index');

      assert.equal(spy.callCount, 0, 'Does not call CORS Middleware');

      return new Promise((resolve) => {
        server.close(() => resolve());
      });
    });
  });
});
