// Different types of things that appear in the search results, that need to be
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

export function resultTypeToString(resultType: ResultType): string {
  switch (resultType) {
    case ResultType.Track:
      return 'Track';
    case ResultType.Artist:
      return 'Artist';
    case ResultType.Album:
      return 'Album';
    case ResultType.Playlist:
      return 'Playlist';
    case ResultType.Mashup:
      return 'Mashup';
    case ResultType.None:
      return 'None';
  }
}

export function stringToResultType(s: string): ResultType {
  switch (s) {
    case 'track':
      return ResultType.Track;
    case 'artist':
      return ResultType.Artist;
    case 'album':
      return ResultType.Album;
    case 'playlist':
      return ResultType.Playlist;
    case 'mashup':
      return ResultType.Mashup;
    default:
      return ResultType.None;
  }
}
