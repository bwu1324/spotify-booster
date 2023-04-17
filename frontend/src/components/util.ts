/**
 * Useful, basic things that are used in multiple places.
 */

import React from 'react';
import axios from 'axios';
import backend_config from '../config/backend_config.js';
import spotify_config from '../config/spotify_config.js';
import { getCookie } from './login/Cookie';

// rendered differently.
export enum ResultType {
  Track,
  Artist,
  Album,
  Playlist,
  Mashup,
  None,
}

// Type that represents a result displayed in the finder list.
export type Result = {
  resultType: ResultType;
  name: string;
  id: string; // If the Result is from Spotify, this is the Spotify ID.
  // TODO: add more information to display when we add that feature.
};

export const EmptyResult = {
  resultType: ResultType.None,
  name: '',
  id: '',
};

export const MashupInCreation: Result = {
  resultType: ResultType.Mashup,
  id: '...',
  name: 'Mashup under Construction',
};

export const MashupContext = React.createContext<{
  mashup: Result;
  setMashup: React.Dispatch<React.SetStateAction<Result>>;
  // eslint-disable-next-line
}>({ mashup: EmptyResult, setMashup: () => {} });

export const AccessTokenContext = React.createContext<{
  token: string | null;
  setToken: Function;
  // eslint-disable-next-line
}>({ token: null, setToken: () => {} });

export type TrackInfo = {
  track_id: string;
  start_ms: number;
  end_ms: number;
};

// We need axios instance because we need to send cookies in the OPTIONS
// request, so we need to specify `withCredentials: true` generally.
export const backendHTTP = axios.create({
  baseURL: backend_config.baseURL,
  withCredentials: true,
});

/**
 * WARNING: We cannot simply use axios.put(), because it automatically sends an
 * OPTIONS request before the PUT request, and the OPTIONS request does not send
 * the spotify_access_token cookie, so the PUT request fails. This is why we
 * need to use getSpotifyAxios(), which creates an axios instance that sends the
 * cookie through the OPTIONS request.
 */

function getSpotifyAxios() {
  return axios.create({
    baseURL: spotify_config.baseURL,
    headers: { Authorization: `Bearer ${getCookie('spotify_access_token')}` },
  });
}

export function playSpotifyTracks(trackIds: string[], deviceId: string) {
  getSpotifyAxios().put(
    '/me/player/play',
    { uris: trackIds },
    { params: { device_id: deviceId } }
  );
}

export function playSpotifyPlayback() {
  getSpotifyAxios().put('/me/player/play', null, {
    baseURL: spotify_config.baseURL,
  });
}

export function pauseSpotifyPlayback() {
  getSpotifyAxios().put('/me/player/pause', null, {
    baseURL: spotify_config.baseURL,
  });
}
