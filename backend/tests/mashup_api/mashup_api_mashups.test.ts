import { assert } from 'chai';
import request from 'supertest';
import path from 'path';
import express from 'express';
import sinon from 'sinon';

import createMashupRouter from '../../src/mashup_api/mashup_api';
import { createDirectory, removeDirectory } from '../test_utils/hooks/create_test_directory.test';
import stubConfig from '../test_utils/stubs/stub_config.test';
import { createLoggerStub, stubLogger } from '../test_utils/stubs/stub_logger.test';
import uniqueID from '../test_utils/unique_id.test';
import { stubSpotifyAuth } from '../test_utils/stubs/stub_spotify_auth.test';
import { createEmptyMashup } from './mashup_api_utils.test';
import { arraysMatchUnordered } from '../test_utils/assertions/arrays_match.test';
import { matchUserMashup } from '../database_interface/database_interface_utils.test';

const TEST_DIRECTORY = path.join(__dirname, 'test_mashup_api_mashups');

describe('Mashup API Mashups', () => {
  before(() => {
    createDirectory(TEST_DIRECTORY);
  });

  beforeEach(async function () {
    stubLogger();
    stubConfig({
      database_config: {
        path: path.join(TEST_DIRECTORY, uniqueID()),
      },
    });
    stubSpotifyAuth('some_user_id', true);

    const { db, mashup_api } = await createMashupRouter(createLoggerStub());

    sinon.stub(db, 'mashupPermission').returns(Promise.resolve(true));

    this.app = express();
    this.app.use(mashup_api);
    this.db = db;
  });

  afterEach(async function () {
    await this.db.close();
  });

  after(() => {
    removeDirectory(TEST_DIRECTORY);
  });

  describe('Mashup API Get User Mashups', () => {
    it('gets users mashups', async function () {
      await this.db.createMashup('other_users_mashup0', 'some_other_user');
      await this.db.createMashup('other_users_mashup1', 'some_other_user');
      const mashup_id0 = await this.db.createMashup('users_mashup0', 'some_user_id');
      const mashup_id1 = await this.db.createMashup('users_mashup1', 'some_user_id');

      const expected0 = [
        { mashup_id: mashup_id0, name: 'users_mashup0' },
        { mashup_id: mashup_id1, name: 'users_mashup1' },
      ];

      const req = request(this.app);
      const response = await req.get('/mashupapi/getUserMashups');
      assert.equal(response.statusCode, 200, 'Responds with success status code');
      arraysMatchUnordered(response.body.mashups, expected0, matchUserMashup, 'Users Mashups');
    });
  });

  describe('Mashup API Create Mashup', () => {
    it('creates mashup with valid name', async function () {
      const mashup_name = 'test_mashup';
      const req0 = request(this.app);
      const response0 = await req0.post(`/mashupapi/createMashup?name=${mashup_name}`);

      assert.equal(response0.statusCode, 200, 'Responds with success status code');
      assert.notEqual(response0.body.mashup_id, '', 'Does not respond with empty mashup_id');

      const req1 = request(this.app);
      const response1 = await req1.get(`/mashupapi/getMashupName?mashup_id=${response0.body.mashup_id}`);

      assert.equal(response1.statusCode, 200, 'Responds with success status code');
      assert.equal(response1.body.name, mashup_name, 'Mashup was created and accessable');
    });

    it('refuses to create mashup with invalid name', async function () {
      const req = request(this.app);
      const response = await req.post('/mashupapi/createMashup');

      assert.equal(response.statusCode, 400, 'Responds with bad request code');
      assert.equal(response.body.error_message, 'Invalid Mashup Name', 'Responds with error message');
    });
  });

  describe('Mashup API Edit Mashup Name', () => {
    beforeEach(async function () {
      this.mashup_id = await createEmptyMashup(this.app);
    });

    it('edits mashup with valid name', async function () {
      const new_name = 'new_mashup_name';
      const response1 = await request(this.app).put(`/mashupapi/setMashupName?mashup_id=${this.mashup_id}&name=${new_name}`);

      assert.equal(response1.statusCode, 200, 'Responds with success status code');

      const req2 = request(this.app);
      const response2 = await req2.get(`/mashupapi/getMashupName?mashup_id=${this.mashup_id}`);

      assert.equal(response2.body.name, new_name, 'Mashup was edited');
    });

    it('refuses to edit mashup with invalid name', async function () {
      const new_name = '';
      const response = await request(this.app).put(`/mashupapi/setMashupName?mashup_id=${this.mashup_id}&name=${new_name}`);

      assert.equal(response.statusCode, 400, 'Responds with bad request code');
      assert.equal(response.body.error_message, 'Invalid Mashup Name', 'Responds with error message');
    });

    it('refuses to edit mashup with invalid mashup_id', async function () {
      const mashup_id = 'invalid';
      const new_name = 'valid_name';
      const response = await request(this.app).put(`/mashupapi/setMashupName?mashup_id=${mashup_id}&name=${new_name}`);

      assert.equal(response.statusCode, 400, 'Responds with bad request code');
      assert.equal(response.body.error_message, 'Invalid Mashup Id', 'Responds with error message');
    });
  });

  describe('Mashup API Delete Mashup', () => {
    beforeEach(async function () {
      this.mashup_id = await createEmptyMashup(this.app);
    });

    it('deletes mashup with valid id', async function () {
      const response1 = await request(this.app).delete(`/mashupapi/deleteMashup?mashup_id=${this.mashup_id}`);

      assert.equal(response1.statusCode, 200, 'Responds with success status code');

      const response2 = await request(this.app).get(`/mashupapi/getMashupName?mashup_id=${this.mashup_id}`);

      assert.equal(response2.statusCode, 400, 'Mashup no longer exists');
      assert.equal(response2.body.error_message, 'Invalid Mashup Id', 'Responds with error message');
    });

    it('refuses to delete mashup with invalid mashup_id', async function () {
      const invalid_mashup_id = 'invalid';
      const response1 = await request(this.app).delete(`/mashupapi/deleteMashup?mashup_id=${invalid_mashup_id}`);

      assert.equal(response1.statusCode, 400, 'Responds with bad request code');
      assert.equal(response1.body.error_message, 'Invalid Mashup Id', 'Responds with error message');

      const response2 = await request(this.app).get(`/mashupapi/getMashupName?mashup_id=${this.mashup_id}`);

      assert.equal(response2.statusCode, 200, 'Mashup still exists');
    });
  });
});
