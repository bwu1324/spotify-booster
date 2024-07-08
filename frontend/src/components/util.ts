/**
 * Useful, basic things that are used in multiple places.
 */

import React from 'react';
import axios from 'axios';
import { config } from '../config/config';
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

export type MashupSection = {
  track: Result;
  startMs: number;
  endMs: number;
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

export const NO_RESULTS: Result[] = [
  {
    resultType: ResultType.None,
    name: 'No results.',
    id: 'N/A',
  },
];

export const LOADING_RESULTS: Result[] = [
  {
    resultType: ResultType.None,
    name: 'Loading...',
    id: 'N/A',
  },
];

export const MashupContext = React.createContext<{
  mashup: Result;
  setMashup: (mashup: any) => any;
   
}>({ mashup: EmptyResult, setMashup: () => { /* */ } });

export const AccessTokenContext = React.createContext<{
  token: string | null;
  setToken: (token: string) => any;
   
}>({ token: null, setToken: () => { /* */ } });

export type TrackInfo = {
  track_id: string;
  start_ms: number;
  end_ms: number;
};

// We need axios instance because we need to send cookies in the OPTIONS
// request, so we need to specify `withCredentials: true` generally.
export const backendHTTP = axios.create({
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
    baseURL: config.spotify_baseURL,
    headers: { Authorization: `Bearer ${getCookie('spotify_access_token')}` },
  });
}

/**
 * Play a Spotify track.
 *
 * @param trackIds Array of Spotify track IDs.
 * @param deviceId Spotify device ID (device id of our web player).
 * @param startMs (optional) Start playback at this position (in ms).
 */
export function playSpotifyTrack(
  trackId: string,
  deviceId: string,
  startMs?: number
) {
  getSpotifyAxios().put(
    '/me/player/play',
    { uris: [`spotify:track:${trackId}`], position_ms: startMs ? startMs : 0 },
    { params: { device_id: deviceId } }
  );
}

export function playSpotifyPlayback() {
  getSpotifyAxios().put('/me/player/play', null, {
    baseURL: config.spotify_baseURL
  });
}

export function pauseSpotifyPlayback() {
  getSpotifyAxios().put('/me/player/pause', null, {
    baseURL: config.spotify_baseURL
  });
}

// Given a Spotify API item, and its type, convert it to a Result.
export function convertSpotifyItem(type: ResultType, item: any): Result {
  return { resultType: type, name: item.name, id: item.id };
}

/* Local Storage Functions */
export function saveDataToLocalStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getDataFromLocalStorage(key: string): any {
  const dataString = localStorage.getItem(key);
  return dataString ? JSON.parse(dataString) : null;
}

export function checkLocalStorageData(key: string): boolean {
  const data = localStorage.getItem(key);
  return data !== null;
}
