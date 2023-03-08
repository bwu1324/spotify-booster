// Different types of things that appear in the search results, that need to be
// rendered differently.
export enum ResultType {
  TRACK, // Render a song. (song name, album, etc.)
  ARTIST,
  ALBUM,
  PLAYLIST,
  MASHUP, // Render a mashup. (mashup name, length, etc.)
}

// Type that represents a result displayed in the finder list.
export type Result = {
  resultType: ResultType;
  name: string;
  // TODO: add more information to display when we add that feature.
};
