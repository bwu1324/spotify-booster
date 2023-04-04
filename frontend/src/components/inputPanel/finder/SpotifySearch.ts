import axios from 'axios';
import { getCookie } from '../../login/Cookie';
import { Result, ResultType } from '../../util';

// Given some search string, query the Spotify API for tracks, artists, albums,
// and playlists.
export async function searchSpotifyFor(query: string, type: ResultType) {
  // This happens when you type in a search query, then delete it all. You are
  // searching for nothing.
  if (query.length === 0) {
    return [];
  }

  // Catch any errors with authentication, or the API request.
  try {
    return await axios
      .get('https://api.spotify.com/v1/search', {
        // Get limit number of results of each given type.
        params: {
          q: query,
          type: ResultType[type].toLowerCase(),
          limit: 10,
        },
        // Give Spotify our access token.
        headers: {
          Authorization: `Bearer ${getCookie('spotify_access_token')}`,
        },
      })
      .then((response) => convertSpotifyResults(response.data));
  } catch (error) {
    console.error(error);
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

// Given a Spotify API item, and its type, convert it to a Result.
function convertSpotifyItem(type: ResultType, item: any): Result {
  return { resultType: type, name: item.name, id: item.id };
}
