// This file creates the Finder component, which is responsible for rendering
// either the search bar and search results, or the current mashup and all the
// songs in the mashup.

import React from 'react';
import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ResultList from './ResultList';
import { Result, ResultType } from '../../util';
import SearchBar from './SearchHeader';
import SearchFilter from './SearchFilter';

// Possible values for what the Finder can display.
export enum FinderView {
  SEARCH, // Display search results.
  MASHUP, // Display songs in the current mashup.
}

function Finder({
  results,
  query,
  searchType,
  setQuery,
  setSearchType,
  queryForResults,
  updateMashupParam,
}: {
  results: Result[];
  query: string;
  searchType: ResultType;
  setResults: Function;
  setQuery: Function;
  setSearchType: Function;
  queryForResults: Function;
  updateMashupParam: Function;
}) {
  const theme = useTheme();

  return (
    <Paper
      color={theme.palette.background.paper}
      sx={{
        maxHeight: '100%',
        display: 'flex', // Prevent the list from overflowing.
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '6px' }}>
        <SearchBar
          query={query}
          updateQuery={async (query: string) => {
            setQuery(query);
            queryForResults(query, searchType);
          }}
        />
        <SearchFilter
          searchType={searchType}
          updateSearchType={async (searchType: ResultType) => {
            setSearchType(searchType);
            queryForResults(query, searchType);
          }}
        />
      </div>
      <ResultList results={results} updateMashupParam={updateMashupParam} />
    </Paper>
  );
}

export default Finder;
