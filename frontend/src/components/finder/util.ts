// Different types of things that appear in the search results, that need to be
// rendered differently.
export enum ResultType {
  TRACK,
  ARTIST,
  ALBUM,
  PLAYLIST,
  MASHUP,
  NONE,
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
    case ResultType.TRACK:
      return 'Track';
    case ResultType.ARTIST:
      return 'Artist';
    case ResultType.ALBUM:
      return 'Album';
    case ResultType.PLAYLIST:
      return 'Playlist';
    case ResultType.MASHUP:
      return 'Mashup';
    case ResultType.NONE:
      return 'None';
  }
}
