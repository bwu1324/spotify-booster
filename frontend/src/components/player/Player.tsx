// This file contains the entire code for the Player component.
// It is a container for the Control and TrackList components.

import { useContext, useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import Control from './Control';
import TrackList from './TrackList';
import {
  AccessTokenContext,
  MashupInCreation,
  MashupSection,
  Result,
  ResultType,
  backendHTTP,
  convertSpotifyItem,
  saveDataToLocalStorage,
} from '../util';
import axios from 'axios';
import { config } from '../../config/config';

/**
 * Converts an array of Spotify track IDs to an array of results.
 *
 * @param tracks Array of Spotify track IDs.
 * @param spotifyAccessToken Valid Spotify access token.
 * @returns Given tracks converted to results.
 */
async function convertSpotifyTracksToResults(
  tracks: any,
  spotifyAccessToken: string
): Promise<Array<Result>> {
  let query = '';
  tracks.forEach((track: any) => {
    query += track.track_id + ',';
  });
  query = query.slice(0, -1);

  try {
    return await axios
      .get('/tracks', {
        baseURL: config.spotify_baseURL,
        params: {
          ids: query,
        },
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      })
      .then((response: any) =>
        response.data.tracks.map((track: any) =>
          convertSpotifyItem(ResultType.Track, track)
        )
      );
  } catch (error) {
    console.error('Error getting tracks:', error);
  }
  return [];
}

/**
 * Convert a backend response to getMashupTracks to an array of MashupSections.
 *
 * @param response Backend response to getMashupTracks.
 * @param spotifyAccessToken Spotify access token. (Possibly null.)
 * @returns Array of MashupSections.
 */
async function convertBackendTrackList(
  response: any,
  spotifyAccessToken: string | null
): Promise<Array<MashupSection>> {
  if (spotifyAccessToken === null) {
    console.error('Spotify access token is null.');
    return [];
  }

  // saveDataToLocalStorage('tracks', response);
  const current_tracks = response.data.tracks;
  const current_tracks_dictionary: Record<
    number,
    {
      track_id: string;
      start_ms: number;
      end_ms: number;
      start_position: number;
    }
  > = {};

  let current_mashup_total_length = 0;
  let current_track_index = 0;
  for (const track of current_tracks) {
    const { track_id, start_ms, end_ms } = track;
    const start_position = current_mashup_total_length;
    current_tracks_dictionary[current_track_index] = {
      track_id,
      start_ms,
      end_ms,
      start_position,
    };
    current_mashup_total_length += end_ms - start_ms;
    current_track_index++;
  }
  saveDataToLocalStorage('tracks', current_tracks_dictionary);

  // current_mashup_total_length = current_mashup_total_length;
  const current_mashup = {
    total_length: current_mashup_total_length,
    increment_stride: parseFloat(
      (100 / current_mashup_total_length).toFixed(8)
    ),
  };
  // const current_mashup = current_tracks_dictionary;

  saveDataToLocalStorage('current_mashup', current_mashup);

  // Get track information from Spotify.
  const tracks = await convertSpotifyTracksToResults(
    response.data.tracks,
    spotifyAccessToken
  );
  // Spotify must return all tracks.
  if (tracks.length !== response.data.tracks.length) {
    console.error("Error converting tracks. Spotify didn't return all tracks.");
  }
  // Fuse the array of Results with the start and end times to create an array
  // of MashupSections.
  const mashupSections: MashupSection[] = [];
  for (let i = 0; i < tracks.length; i++) {
    mashupSections.push({
      track: tracks[i],
      startMs: response.data.tracks[i].start_ms,
      endMs: response.data.tracks[i].end_ms,
    });
  }

  return mashupSections;
}

/**
 * Get the MashupSections that make up a mashup.
 *
 * @param mashup The currently selected mashup.
 * @param spotifyAccessToken Spotify access token. (Possibly null.)
 * @returns An array of MashupSections (a Result with start and end times).
 */
async function getTracksInMashup(
  mashup: Result,
  spotifyAccessToken: string | null
): Promise<Array<MashupSection>> {
  if (mashup.resultType !== ResultType.Mashup || mashup === MashupInCreation)
    return [];

  try {
    return await backendHTTP
      .get('mashupapi/getMashupTracks', {
        params: { mashup_id: mashup.id },
      })
      .then((response) =>
        convertBackendTrackList(response, spotifyAccessToken)
      );
  } catch (error) {
    console.error('Error getting mashup tracks:', error);
  }
  return [];
}

export default function Player({ mashup }: { mashup: Result }) {
  // The list of songs in a mashup.
  const [mashupSections, setMashupSections] = useState<Array<MashupSection>>(
    []
  );

  // The current song that should be playing.
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);

  // Spotify access token.
  const spotifyAccessToken = useContext(AccessTokenContext).token;

  useEffect(() => {
    getTracksInMashup(mashup, spotifyAccessToken).then((sections) => {
      if (sections.length !== 0) setCurrentTrack(0);
      else setCurrentTrack(null);
      setMashupSections(sections);
    });
  }, [mashup, spotifyAccessToken]);

  const tracks = mashupSections.map((track) => track.track);

  return (
    <Grid container style={{ height: '100%' }}>
      <Grid item xs={12} sx={{ paddingBottom: 2 }} style={{ height: '20%' }}>
        <Control
          mashupSections={mashupSections}
          currentTrack={currentTrack}
          updateCurrentTrack={setCurrentTrack}
        />
      </Grid>
      <Grid item xs={12} style={{ height: '80%' }}>
        <TrackList tracks={tracks} currentTrack={currentTrack} />
      </Grid>
    </Grid>
  );
}
