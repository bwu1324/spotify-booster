// This file creates the Finder component, which is responsible for rendering
// either the search bar and search results, or the current mashup and all the
// songs in the mashup.

import React, { useContext, useState } from 'react';
import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ResultList from './ResultList';
import SearchHeader from './SearchHeader';
import { searchSpotifyFor } from './SpotifySearch';
import { AccessTokenContext, Result, ResultType } from '../../util';
import { searchBackendForMashups } from './MashupSearch';

const NO_RESULTS: Result[] = [
  {
    resultType: ResultType.None,
    name: 'No results.',
    id: 'N/A',
  },
];

const LOADING_RESULTS: Result[] = [
  {
    resultType: ResultType.None,
    name: 'Loading...',
    id: 'N/A',
  },
];

// Possible values for what the Finder can display.
export enum FinderView {
  SEARCH, // Display search results.
  MASHUP, // Display songs in the current mashup.
}

function Finder({ updateMashupParam }: { updateMashupParam: Function }) {
  // What screen the Finder should display.
  const [view, setView] = useState(FinderView.SEARCH);
  // Current query for the search bar.
  const [query, setQuery] = useState('');
  // Current search filter.
  const [searchType, setSearchType] = useState(ResultType.Track);
  const mashupID = 'Example Mashup Title';
  const [results, setResults] = useState<Result[]>([]);
  const theme = useTheme();
  const spotifyAccessToken = useContext(AccessTokenContext).token;

  async function handleViewChange(newView: FinderView) {
    setView(newView);
    switch (newView) {
      case FinderView.SEARCH:
        // Prevent incorrect results from being displayed while waiting for a
        // response from Spotify.
        setResults([]);
        setResults(
          await searchSpotifyFor(query, searchType, spotifyAccessToken)
        );
        break;
      case FinderView.MASHUP:
        setResults(
          // TODO: this is a placeholder while we don't have mashups integrated.
          NO_RESULTS
        );
        break;
      default:
    }
  }

  async function updateResults(query: string, searchType: ResultType) {
    setResults(LOADING_RESULTS);
    let response: Result[] = [];
    if (query === '') {
      // Don't search for anything if there is no query.
    } else if (searchType === ResultType.Mashup) {
      // Search the backend for mashups.
      response = await searchBackendForMashups(query, spotifyAccessToken);
      if (response.length === 0) setResults(NO_RESULTS);
      else setResults(response);
    } else {
      // Search Spotify given params.
      response = await searchSpotifyFor(query, searchType, spotifyAccessToken);
    }
    if (response.length === 0) setResults(NO_RESULTS);
    else setResults(response);
  }

  return (
    <Paper
      color={theme.palette.background.paper}
      sx={{
        maxHeight: '100%',
        display: 'flex', // Prevent the list from overflowing.
        flexDirection: 'column',
      }}
    >
      <SearchHeader
        view={view}
        query={query}
        searchType={searchType}
        handleViewChange={handleViewChange}
        updateQuery={async (query: string) => {
          setQuery(query);
          updateResults(query, searchType);
        }}
        updateSearchType={async (searchType: ResultType) => {
          setSearchType(searchType);
          updateResults(query, searchType);
        }}
        mashupID={mashupID}
      />

      <ResultList results={results} updateMashupParam={updateMashupParam} />
    </Paper>
  );
}

export default Finder;
