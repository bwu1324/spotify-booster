/**
 * Useful, basic things that are used in multiple places.
 */

import React from 'react';
import axios from 'axios';
import backend_config from '../config/backend_config.js';

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
}>({ mashup: EmptyResult, setMashup: () => {} });

export type TrackInfo = {
  track_id: string;
  start_ms: number;
  end_ms: number;
};

// We need axios instance because we need to send cookies in the OPTIONS
// request, so we need to specify `withCredentials: true` generally.
export const backendHTTP = axios.create({
  baseURL: backend_config.base_url,
  withCredentials: true,
});
