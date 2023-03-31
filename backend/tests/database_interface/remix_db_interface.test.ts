import { assert } from 'chai';
import path from 'path';
import crypto from 'crypto';

import DatabaseInterface from '../../src/database_interface/database_interface';
import { createDirectory, removeDirectory } from '../test_utils/hooks/create_test_directory.test';
import { stubLogger } from '../test_utils/stubs/stub_logger.test';
import uniqueID from '../test_utils/unique_id.test';

const TEST_DB_DIRECTORY = path.join(__dirname, 'test_mashup_db_interface');

describe('Mashup DB Interface', () => {
  before(() => {
    createDirectory(TEST_DB_DIRECTORY);
  });

  beforeEach(function () {
    stubLogger();
    this.db_location = path.join(TEST_DB_DIRECTORY, uniqueID());
    this.db = new DatabaseInterface(this.db_location);
  });

  afterEach(async function () {
    await this.db.close();
  });

  after(() => {
    removeDirectory(TEST_DB_DIRECTORY);
  });

  describe('Creating Mashpes', () => {
    it('creates a new mashup with a unique id and given name and trims name', async function () {
      const id0 = await this.db.createMashup('test_mashup');
      const id1 = await this.db.createMashup(' test_mashup ');

      assert.equal(await this.db.mashupCount(), 2, 'Creates exactly 2 mashups');
      assert.notEqual(id0, id1, 'Mashup ids are unique');
      assert.equal(await this.db.getMashupName(id0), 'test_mashup', 'Database contains new mashup 0');
      assert.equal(await this.db.getMashupName(id1), 'test_mashup', 'Database contains new mashup 1');
    });

    it('rejects blank mashup name when creating mashup', async function () {
      const invalid_names = [
        '', // blank
        null, // null
        ' ', // whitespace
        '\n',
        '\t',
        '\r',
      ];
      for (const name of invalid_names) {
        await assert.isRejected(this.db.createMashup(name), 'Invalid Mashup Name');
      }

      assert.equal(await this.db.mashupCount(), 0, 'Creates exactly 0 mashups');
    });

    it('rejects promise if getting name of invalid mashup id', async function () {
      const id0 = await this.db.createMashup('test_mashup0');
      const id1 = await this.db.createMashup('test_mashup1');

      const invalid_ids = [
        '', // blank
        '\n',
        ' ',
        '%', // invalid base64 characters
        '!',
        '=!',
        'asdf', // too short
        id0 + 'a', // similar to existing id
        'a' + id0,
        id0 + id1,
        crypto.createHash('sha256').update((100).toString()).digest('base64'), // correct format but non existing id
      ];
      for (const invalid of invalid_ids) {
        await assert.isRejected(this.db.getMashupName(invalid), 'Invalid Mashup Id');
      }

      assert.equal(await this.db.mashupCount(), 2, 'Creates exactly 2 mashups');
      assert.equal(await this.db.getMashupName(id0), 'test_mashup0', 'Does not update other mashups');
      assert.equal(await this.db.getMashupName(id1), 'test_mashup1', 'Does not update other mashups');
    });
  });

  describe('Editing Mashpes', () => {
    beforeEach(async function () {
      this.id0 = await this.db.createMashup('test_mashup0');
      this.id1 = await this.db.createMashup('test_mashup1');
    });

    it('updates name of valid mashup id with trimmed name', async function () {
      await this.db.setMashupName(this.id0, ' new_name ');

      assert.equal(await this.db.mashupCount(), 2, 'Creates exactly 2 mashups');
      assert.equal(await this.db.getMashupName(this.id0), 'new_name', 'Updates mashup name with new name');
      assert.equal(await this.db.getMashupName(this.id1), 'test_mashup1', 'Does not update other mashups');
    });

    it('rejects promise if changing name of with invalid name', async function () {
      const invalid_names = [
        '', // blank
        null, // null
        ' ', // whitespace
        '\n',
        '\t',
        '\r',
      ];
      for (const name of invalid_names) {
        await assert.isRejected(this.db.setMashupName(this.id0, name), 'Invalid Mashup Name');
      }

      assert.equal(await this.db.mashupCount(), 2, 'Creates exactly 2 mashups');
      assert.equal(await this.db.getMashupName(this.id0), 'test_mashup0', 'Does not update mashup name with new name');
      assert.equal(await this.db.getMashupName(this.id1), 'test_mashup1', 'Does not update other mashups');
    });

    it('rejects promise if changing name of invalid mashup id', async function () {
      const invalid_ids = [
        '', // blank
        '\n',
        ' ',
        '%', // invalid base64 characters
        '!',
        '=!',
        'asdf', // too short
        this.id0 + 'a', // similar to existing id
        'a' + this.id0,
        this.id0 + this.id1,
        crypto.createHash('sha256').update((100).toString()).digest('base64'), // correct format but non existing id
      ];
      for (const invalid of invalid_ids) {
        await assert.isRejected(this.db.setMashupName(invalid, 'new_name'), 'Invalid Mashup Id');
      }

      assert.equal(await this.db.mashupCount(), 2, 'Creates exactly 2 mashups');
      assert.equal(await this.db.getMashupName(this.id0), 'test_mashup0', 'Does not update mashup name with new name');
      assert.equal(await this.db.getMashupName(this.id1), 'test_mashup1', 'Does not update other mashups');
    });
  });

  describe('Deleting Mashpes', () => {
    beforeEach(async function () {
      this.id0 = await this.db.createMashup('test_mashup0');
      this.id1 = await this.db.createMashup('test_mashup1');
    });

    it('deletes a valid mashup id', async function () {
      await this.db.deleteMashup(this.id0);

      assert.equal(await this.db.mashupCount(), 1, 'Exactly 1 mashup remains');
      assert.equal(await this.db.getMashupName(this.id1), 'test_mashup1', 'Does not delete other mashups');
    });

    it('rejects promise if deleting invalid mashup id', async function () {
      const invalid_ids = [
        '', // blank
        '\n',
        ' ',
        '%', // invalid base64 characters
        '!',
        '=!',
        'asdf', // too short
        this.id0 + 'a', // similar to existing id
        'a' + this.id0,
        this.id0 + this.id1,
        crypto.createHash('sha256').update((100).toString()).digest('base64'), // correct format but non existing id
      ];
      for (const invalid of invalid_ids) {
        await assert.isRejected(this.db.deleteMashup(invalid), 'Invalid Mashup Id');
      }

      assert.equal(await this.db.mashupCount(), 2, 'Exactly 2 mashups remains');
      assert.equal(await this.db.getMashupName(this.id0), 'test_mashup0', 'Does not delete other mashups');
      assert.equal(await this.db.getMashupName(this.id1), 'test_mashup1', 'Does not delete other mashups');
    });
  });
});
