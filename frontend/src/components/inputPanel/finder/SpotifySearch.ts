import axios from 'axios';
import { Result, ResultType, convertSpotifyItem } from '../../util';
import { config } from '../../../config/config';

// Given some search string, query the Spotify API for tracks, artists, albums,
// and playlists.
export async function searchSpotifyFor(
  query: string,
  type: ResultType,
  spotifyAccessToken: string | null
) {
  // This happens when you type in a search query, then delete it all. You are
  // searching for nothing.
  if (query.length === 0 || spotifyAccessToken === null) {
    return [];
  }

  // Catch any errors with authentication, or the API request.
  try {
    return await axios
      .get('/search', {
        baseURL: config.spotify_baseURL,
        // Get limit number of results of each given type.
        params: {
          q: query,
          type: ResultType[type].toLowerCase(),
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      })
      .then((response) => convertSpotifyResults(response.data));
  } catch (error) {
    console.error('Spotify Access Token:', spotifyAccessToken, error);
    return [];
  }
}

// Convert a given Spotify API response to a list of Results so they are easier
// to manange.
function convertSpotifyResults(item: any): Array<Result> {
  const results: Array<Result> = [];
  // Each object returned from Spotify needs to be handled uniqely, so each of
  // these must be separately handled.
  if (item.tracks)
    item.tracks.items.map((track: any) => {
      results.push(convertSpotifyItem(ResultType.Track, track));
    });
  if (item.artists)
    item.artists.items.map((artist: any) => {
      results.push(convertSpotifyItem(ResultType.Artist, artist));
    });
  if (item.albums)
    item.albums.items.map((album: any) => {
      results.push(convertSpotifyItem(ResultType.Album, album));
    });
  if (item.playlists)
    item.playlists.items.map((playlist: any) => {
      results.push(convertSpotifyItem(ResultType.Playlist, playlist));
    });

  return results;
}
