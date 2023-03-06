// Component for the list shown in the finder.

import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { Result, ResultType } from './Finder';

// Used for rendering each result.
function renderResult(result: Result): JSX.Element {
  return (
    <ListItem
      key={
        (result.resultType == ResultType.SONG ? 'song' : 'mashup') +
        `-${result.name}`
      }
    >
      <ListItemText>{result.name}</ListItemText>
    </ListItem>
  );
}

function ResultList({ results }: { results: Array<Result> }) {
  return (
    <div
      style={{
        overflowY: 'auto', // scroll on overflow
      }}
    >
      <List>{results.map((result) => renderResult(result))}</List>
    </div>
  );
}

export default ResultList;
