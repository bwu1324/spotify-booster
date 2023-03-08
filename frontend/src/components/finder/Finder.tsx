// This file creates the Finder component, which is responsible for rendering
// either the search bar and search results, or the current mashup and all the
// songs in the mashup.

import { Paper } from '@mui/material';
import React, { useState } from 'react';
import ResultList from './ResultList';
import SearchHeader from './SearchHeader';
import { useTheme } from '@mui/material/styles';
import { ResultType } from './util';

// Possible values for what the Finder can display.
export enum FinderView {
  SEARCH, // Display search results.
  MASHUP, // Display songs in the current mashup.
}

function Finder() {
  const [view, setView] = useState(FinderView.SEARCH);
  const mashupID = 'Example Mashup Title';
  const [results, setResults] = useState([
    { resultType: ResultType.NONE, name: 'Not Found', id: 'N/A' },
  ]);
  const theme = useTheme();

  function handleViewChange(newView: FinderView) {
    setView(newView);
    switch (newView) {
      case FinderView.SEARCH:
        setResults([]);
        break;
      case FinderView.MASHUP:
        setResults([
          // TODO: this is a placeholder while we don't have mashups integrated.
          { resultType: ResultType.NONE, name: 'Not Found', id: 'N/A' },
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
        handleViewChange={handleViewChange}
        updateResultsCallback={setResults}
        mashupID={mashupID}
      />
      <ResultList results={results} />
    </Paper>
  );
}

export default Finder;
