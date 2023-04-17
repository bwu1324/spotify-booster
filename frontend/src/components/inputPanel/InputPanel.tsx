/**
 * This component is the parent of the Finder and MashupTool components. It
 * needs to exist so that the Finder and MashupTool components can share state.
 *
 * When the user clicks on a result in the Finder component, the Finder
 * component calls the updateMashupParam function to set the seed parameters for
 * creating a mashup.
 */

import React, { useContext, useState } from 'react';
import Finder from './finder/Finder';
import MashupTool from './mashupTool/MashupTool';
import {
  AccessTokenContext,
  EmptyResult,
  LOADING_RESULTS,
  NO_RESULTS,
  Result,
  ResultType,
} from '../util';
import { searchBackendForMashups } from './finder/MashupSearch';
import { searchSpotifyFor } from './finder/SpotifySearch';

function InputPanel() {
  // The start song is the song that the mashup will start with.
  const [startSong, setStartSong] = useState<Result>(EmptyResult);
  // The song repo is the album/playlist that the mashup will draw songs from.
  const [songRepo, setSongRepo] = useState<Result>(EmptyResult);

  const [results, setResults] = useState<Result[]>([]);
  // Current query for the search bar.
  const [query, setQuery] = useState('');
  // Current search filter.
  const [searchType, setSearchType] = useState(ResultType.Track);
  const spotifyAccessToken = useContext(AccessTokenContext).token;

  // Updates state if input is valid. (e.g. startSong cannot be an album)
  function handleNewMashupParam(param: Result) {
    if (param.resultType === ResultType.Track) {
      setStartSong(param);
    } else if (
      param.resultType === ResultType.Album ||
      param.resultType === ResultType.Playlist
    ) {
      setSongRepo(param);
    }
  }

  // Resets the start song and song repo.
  function resetMashupParams() {
    setStartSong(EmptyResult);
    setSongRepo(EmptyResult);
  }

  async function queryForResults(query: string, searchType: ResultType) {
    setResults(LOADING_RESULTS);
    let response: Result[] = [];
    if (searchType === ResultType.Mashup) {
      // Search the backend for mashups.
      response = await searchBackendForMashups(query, spotifyAccessToken);
    } else if (query !== '') {
      // Search Spotify given params.
      response = await searchSpotifyFor(query, searchType, spotifyAccessToken);
    }
    if (response.length === 0) setResults(NO_RESULTS);
    else setResults(response);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <MashupTool
        startSong={startSong}
        songRepo={songRepo}
        resetResults={() => queryForResults(query, searchType)}
        resetMashupParams={resetMashupParams}
      />
      <Finder
        results={results}
        query={query}
        searchType={searchType}
        setResults={setResults}
        setQuery={setQuery}
        setSearchType={setSearchType}
        queryForResults={queryForResults}
        updateMashupParam={handleNewMashupParam}
      />
    </div>
  );
}

export default InputPanel;
