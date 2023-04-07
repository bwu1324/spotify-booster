import { assert } from 'chai';
import DatabaseInterface from '../../src/database_interface/database_interface';
import { TrackInfo } from '../../src/database_interface/track_db_interface';
import { arraysMatchOrdered } from '../test_utils/assertions/arrays_match.test';

/**
 * matchTracks() - Compares two tracks and returns true if they match
 * @param a - A TrackInfo object
 * @param b - Another TrackInfo object
 * @returns - if tracks match or not
 */
export function matchTracks(a: TrackInfo, b: TrackInfo): boolean {
  return a.track_id === b.track_id && a.start_ms === b.start_ms && a.end_ms === b.end_ms;
}

/**
 * checkTrackDB() - Checks that track database contains the expected data
 * @param db - database to check
 * @param id0 - mashup id of mashup0
 * @param id1 - mashup id of mashup1
 * @param expected0 - expected tracks in mashup0
 * @param expected1 - rexpected tracks in mashup1
 * @param total_tracks - total tracks expected in database
 */
export async function checkTrackDB(
  db: DatabaseInterface,
  id0: string,
  id1: string,
  expected0: TrackInfo[],
  expected1: TrackInfo[],
  total_tracks: number
) {
  assert.equal(await db.totalTrackCount(), total_tracks, `Database contains ${total_tracks} tracks`);
  arraysMatchOrdered(await db.getMashupTracks(id0), expected0, 'Mashup 0 Tracks', matchTracks);
  arraysMatchOrdered(await db.getMashupTracks(id1), expected1, 'Mashup 1 Tracks', matchTracks);
}

/**
 * matchUserMahup() - compares two mashups to check that they match
 * @param a - actual track
 * @param e - expected track
 */
export function matchUserMashup(a: { mashup_id: string; name: string }, e: { mashup_id: string; name: string }): boolean {
  return a.mashup_id === e.mashup_id && a.name === e.name;
}
