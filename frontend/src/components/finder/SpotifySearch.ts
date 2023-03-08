import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import { getCookie } from '../login/Cookie';
import { Result, ResultType } from './util';

export async function searchSpotifyFor(query: string) {
  const http = axios.create({
    baseURL: 'https://api.spotify.com/',
    headers: {
      Authorization: `Bearer ${getCookie('spotify_access_token')}`,
    },
  });

  try {
    return await http
      .get('/v1/search', {
        params: { q: query, type: 'track,artist,album,playlist' },
      })
      .then((response) => convertSpotifyResults(response.data));
  } catch (error) {
    console.error(error);
    return [];
  }
}

function convertSpotifyResults(item: any): Array<Result> {
  const results: Array<Result> = [];
  item.tracks.items.map((track: any) => {
    results.push(convertSpotifyItem(ResultType.TRACK, track));
  });
  item.artists.items.map((artist: any) => {
    results.push(convertSpotifyItem(ResultType.ARTIST, artist));
  });
  item.albums.items.map((album: any) => {
    results.push(convertSpotifyItem(ResultType.ALBUM, album));
  });
  item.playlists.items.map((playlist: any) => {
    results.push(convertSpotifyItem(ResultType.PLAYLIST, playlist));
  });

  return results;
}

function convertSpotifyItem(type: ResultType, item: any): Result {
  return { resultType: type, name: item.name };
}
