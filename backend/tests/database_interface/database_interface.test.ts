import { assert } from 'chai';
import fs from 'fs-extra';
import path from 'path';

import DatabaseInterface from '../../src/database_interface/database_interface';
import { arraysMatchUnordered } from '../test_utils/assertions/arrays_match.test';
import { createDirectory, removeDirectory } from '../test_utils/hooks/create_test_directory.test';
import { stubLogger } from '../test_utils/stubs/stub_logger.test';
import uniqueID from '../test_utils/unique_id.test';
import { matchTracks } from './database_interface_utils.test';

const TEST_DB_DIRECTORY = path.join(__dirname, 'test_database_interface');

describe('Database Interface', () => {
  before(() => {
    createDirectory(TEST_DB_DIRECTORY);
  });

  beforeEach(() => {
    stubLogger();
  });

  after(() => {
    removeDirectory(TEST_DB_DIRECTORY);
  });

  describe('New Database Interface Initialization', () => {
    it('creates a new database at given location', (done) => {
      const db_location = path.join(TEST_DB_DIRECTORY, uniqueID());
      const db = new DatabaseInterface(db_location);

      setTimeout(async () => {
        assert(fs.existsSync(db_location), 'Database was not created at expected location');

        assert.equal(await db.mashupCount(), 0, 'Creates empty mashup table');
        assert.equal(await db.totalTrackCount(), 0, 'Creates empty track table');

        await db.close();
        done();
      }, 500);
    });
  });

  describe('Existing Database Initialization', () => {
    it('opens an existing database and finds existing tracks and mashups', async () => {
      const db_location = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'tests',
        'database_interface',
        'database_interface.test.db'
      );
      const db = new DatabaseInterface(db_location);

      const id0 = 'WeWkXbxl7OQXyqAImuOdHBnI+lgKbvr+jI1t0JJ5xTo=';
      const name0 = 'mashup_0';
      const mashup0_tracks = [
        { track_id: 'spotify_track_0', start_ms: 11, end_ms: 22 },
        { track_id: 'spotify_track_1', start_ms: 10, end_ms: 20 },
        { track_id: 'spotify_track_2', start_ms: 9, end_ms: 18 },
        { track_id: 'spotify_track_3', start_ms: 8, end_ms: 16 },
      ];
      const id1 = 'EeaNp8zxcWNhIUSWB11RgmTVFTWKzQWhWbifslF/JCY=';
      const name1 = 'mashup_1';
      const mashup1_tracks = [
        { track_id: 'spotify_track_0', start_ms: 7, end_ms: 14 },
        { track_id: 'spotify_track_2', start_ms: 6, end_ms: 12 },
        { track_id: 'spotify_track_4', start_ms: 5, end_ms: 10 },
        { track_id: 'spotify_track_6', start_ms: 4, end_ms: 8 },
      ];
      const id2 = 'ZDcGdnwaORyeNmrFLeJvhc78pIHNCLSMJOZ5vaBQBjE=';
      const name2 = 'mashup_2';
      const mashup2_tracks = [
        { track_id: 'spotify_track_0', start_ms: 3, end_ms: 6 },
        { track_id: 'spotify_track_3', start_ms: 2, end_ms: 4 },
        { track_id: 'spotify_track_6', start_ms: 1, end_ms: 2 },
        { track_id: 'spotify_track_9', start_ms: 0, end_ms: -1 },
      ];

      assert.equal(await db.mashupCount(), 3, 'Database contains 3 mashups');
      assert.equal(await db.totalTrackCount(), 12, 'Database contains 12 tracks');
      assert.equal(await db.getMashupName(id0), name0, 'Mashup 0 has correct name');
      assert.equal(await db.getMashupName(id1), name1, 'Mashup 1 has correct name');
      assert.equal(await db.getMashupName(id2), name2, 'Mashup 2 has correct name');
      arraysMatchUnordered(await db.getMashupTracks(id0), mashup0_tracks, matchTracks, 'Mashup 0 Tracks');
      arraysMatchUnordered(await db.getMashupTracks(id1), mashup1_tracks, matchTracks, 'Mashup 1 Tracks');
      arraysMatchUnordered(await db.getMashupTracks(id2), mashup2_tracks, matchTracks, 'Mashup 2 Tracks');

      await db.close();
    });
  });
});
