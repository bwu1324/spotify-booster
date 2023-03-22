import { assert } from 'chai';
import request from 'supertest';
import path from 'path';
import express from 'express';

import createRemixRouter from './remix_api';
import { arrays_match_unordered } from '../database_interface/track_db_interface.test';
import Logger from '../logger/logger';

const DB_LOCATION = path.join(__dirname, 'test.db');

/**
 * createRemix() - sends post request to create a remix and returns its id
 * @returns - remix_id and app
 */
async function createRemix() {
  const log = new Logger('Test');
  const router = createRemixRouter(log, DB_LOCATION);
  const app = express();
  app.use(router);
  const remix_name = 'text_remix';
  const req0 = request(app);
  const response = await req0.post(`/remixapi/createRemix?name=${remix_name}`);
  return { remix_id: response.body.remix_id, app };
}

describe('Remix API Add Track', () => {
  it('adds track with valid remix_id', async () => {
    const { remix_id, app } = await createRemix();

    const tracks = [
      { track_id: '6wmcrRId5aeo7hiEqHAtEO', start_ms: 0, end_ms: -1 },
      { track_id: '5OtpvLAq1uUQ6YmgxbI98H', start_ms: 0, end_ms: -1 },
      { track_id: '3mjqoMavGRKBfLiiKuV267', start_ms: 0, end_ms: -1 },
    ];
    for (let i = 0; i < tracks.length; i++) {
      const response1 = await request(app).put(
        `/remixapi/addTrack?remix_id=${remix_id}&track_id=${tracks[i].track_id}`
      );
      assert(response1.statusCode === 200, 'Responds with success status code');
    }

    const response2 = await request(app).get(
      `/remixapi/getRemixTracks?remix_id=${remix_id}`
    );

    assert(response2.statusCode === 200, 'Responds with success status code');
    assert(
      arrays_match_unordered(response2.body.tracks, tracks),
      'Tracks were added correctly'
    );
  });

  it('refuses to add track with invalid remix_id', async () => {
    const { app } = await createRemix();

    const remix_id = 'invalid';
    const track_id = '6wmcrRId5aeo7hiEqHAtEO';
    const response = await request(app).put(
      `/remixapi/addTrack?remix_id=${remix_id}&track_id=${track_id}`
    );

    assert(response.statusCode === 400, 'Responds with bad request code');
    assert(
      response.body.error_message === 'Invalid Remix Id',
      'Responds with error message'
    );
  });

  it('refuses to add track with invalid track_id', async () => {
    const { remix_id, app } = await createRemix();

    const track_id = '';
    const response = await request(app).put(
      `/remixapi/addTrack?remix_id=${remix_id}&track_id=${track_id}`
    );

    assert(response.statusCode === 400, 'Responds with bad request code');
    assert(
      response.body.error_message === 'Invalid Track Id',
      'Responds with error message'
    );
  });
});

describe('Remix API Delete Track', () => {
  it('deletes track with valid remix_id', async () => {
    const { remix_id, app } = await createRemix();
    const tracks = [
      { track_id: '6wmcrRId5aeo7hiEqHAtEO', start_ms: 0, end_ms: -1 },
      { track_id: '5OtpvLAq1uUQ6YmgxbI98H', start_ms: 0, end_ms: -1 },
      { track_id: '3mjqoMavGRKBfLiiKuV267', start_ms: 0, end_ms: -1 },
    ];
    for (let i = 0; i < tracks.length; i++) {
      await request(app).put(
        `/remixapi/addTrack?remix_id=${remix_id}&track_id=${tracks[i].track_id}`
      );
    }

    const response2 = await request(app).delete(
      `/remixapi/removeTrack?remix_id=${remix_id}&track_id=${tracks[0].track_id}`
    );
    tracks.splice(0, 1);

    assert(response2.statusCode === 200, 'Responds with success status code');

    const response3 = await request(app).get(
      `/remixapi/getRemixTracks?remix_id=${remix_id}`
    );
    assert(
      arrays_match_unordered(response3.body.tracks, tracks),
      'Tracks were deleted correctly'
    );
  });

  it('refuses to add track with invalid remix_id', async () => {
    const { remix_id, app } = await createRemix();
    const tracks = [
      { track_id: '6wmcrRId5aeo7hiEqHAtEO', start_ms: 0, end_ms: -1 },
      { track_id: '5OtpvLAq1uUQ6YmgxbI98H', start_ms: 0, end_ms: -1 },
      { track_id: '3mjqoMavGRKBfLiiKuV267', start_ms: 0, end_ms: -1 },
    ];
    for (let i = 0; i < tracks.length; i++) {
      await request(app).put(
        `/remixapi/addTrack?remix_id=${remix_id}&track_id=${tracks[i].track_id}`
      );
    }

    const invalid_remix_id = 'invalid';
    const response2 = await request(app).delete(
      `/remixapi/removeTrack?remix_id=${invalid_remix_id}&track_id=${tracks[0]}`
    );

    assert(response2.statusCode === 400, 'Responds with bad request code');
    assert(
      response2.body.error_message === 'Invalid Remix Id',
      'Responds with error message'
    );

    const response3 = await request(app).get(
      `/remixapi/getRemixTracks?remix_id=${remix_id}`
    );
    assert(
      arrays_match_unordered(response3.body.tracks, tracks),
      'Tracks were not deleted'
    );
  });

  it('refuses to delete track with invalid track_id', async () => {
    const { remix_id, app } = await createRemix();
    const tracks = [
      { track_id: '6wmcrRId5aeo7hiEqHAtEO', start_ms: 0, end_ms: -1 },
      { track_id: '5OtpvLAq1uUQ6YmgxbI98H', start_ms: 0, end_ms: -1 },
      { track_id: '3mjqoMavGRKBfLiiKuV267', start_ms: 0, end_ms: -1 },
    ];
    for (let i = 0; i < tracks.length; i++) {
      await request(app).put(
        `/remixapi/addTrack?remix_id=${remix_id}&track_id=${tracks[i].track_id}`
      );
    }

    const invalid_track_id = 'invalid';
    const response2 = await request(app).delete(
      `/remixapi/removeTrack?remix_id=${remix_id}&track_id=${invalid_track_id}`
    );

    assert(response2.statusCode === 400, 'Responds with bad request code');
    assert(
      response2.body.error_message === 'Invalid Track Id',
      'Responds with error message'
    );

    const response3 = await request(app).get(
      `/remixapi/getRemixTracks?remix_id=${remix_id}`
    );
    assert(
      arrays_match_unordered(response3.body.tracks, tracks),
      'Tracks were not deleted'
    );
  });
});

describe('Remix API Get Tracks', () => {
  it('refuses to get tracks with invalid remix_id', async () => {
    const { remix_id, app } = await createRemix();
    const tracks = [
      { track_id: '6wmcrRId5aeo7hiEqHAtEO', start_ms: 0, end_ms: -1 },
      { track_id: '5OtpvLAq1uUQ6YmgxbI98H', start_ms: 0, end_ms: -1 },
      { track_id: '3mjqoMavGRKBfLiiKuV267', start_ms: 0, end_ms: -1 },
    ];
    for (let i = 0; i < tracks.length; i++) {
      await request(app).put(
        `/remixapi/addTrack?remix_id=${remix_id}&track_id=${tracks[i].track_id}`
      );
    }

    const invalid_remix_id = 'invalid';

    const response = await request(app).get(
      `/remixapi/getRemixTracks?remix_id=${invalid_remix_id}`
    );
    assert(response.statusCode === 400, 'Responds with bad request code');
    assert(
      response.body.error_message === 'Invalid Remix Id',
      'Responds with error message'
    );
  });
});
