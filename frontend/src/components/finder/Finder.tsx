// This file creates the Finder component, which is responsible for rendering
// either the search bar and search results, or the current mashup and all the
// songs in the mashup.

import { Divider, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import SearchHeader from './SearchHeader';
import { useTheme } from '@mui/material/styles';
import { ResultType } from './util';
import { searchSpotifyFor } from './SpotifySearch';

// Possible values for what the Finder can display.
export enum FinderView {
  SEARCH, // Display search results.
  MASHUP, // Display songs in the current mashup.
}

function Finder() {
  const [view, setView] = useState(FinderView.SEARCH);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState(ResultType.Track);
  const mashupID = 'Example Mashup Title';
  const [results, setResults] = useState([
    { resultType: ResultType.None, name: 'No results', id: 'N/A' },
  ]);
  const theme = useTheme();

  async function handleViewChange(newView: FinderView) {
    setView(newView);
    switch (newView) {
      case FinderView.SEARCH:
        setResults([]);
        setResults(await searchSpotifyFor(query, searchType));
        break;
      case FinderView.MASHUP:
        setResults([
          // TODO: this is a placeholder while we don't have mashups integrated.
          { resultType: ResultType.None, name: 'No results', id: 'N/A' },
        ]);
        break;
      default:
    }
  }

  return (
    <Paper
      color={theme.palette.background.paper}
      sx={{
        width: '35%',
        maxHeight: 600,
        display: 'flex', // Prevent the list from overflowing.
        flexDirection: 'column',
        margin: 2,
      }}
      elevation={5}
    >
      <SearchHeader
        view={view}
        query={query}
        searchType={searchType}
        handleViewChange={handleViewChange}
        updateQuery={async (query: string) => {
          setResults([]);
          setQuery(query);
          setResults(await searchSpotifyFor(query, searchType));
        }}
        updateSearchType={async (searchType: ResultType) => {
          setResults([]);
          setSearchType(searchType);
          setResults(await searchSpotifyFor(query, searchType));
        }}
        updateResults={setResults}
        mashupID={mashupID}
      />
      <Divider />
      <ResultList results={results} />
    </Paper>
  );
}

export default Finder;
