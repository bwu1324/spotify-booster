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

export const EmptyResult = {
  resultType: ResultType.None,
  name: '',
  id: '',
};
