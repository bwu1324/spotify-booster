// Component for the list shown in the finder.

import React from 'react';
import { List, ListItem, ListItemText, useTheme } from '@mui/material';
import { Result, ResultType } from './util';

// Used for rendering each result.
function renderResult(result: Result): JSX.Element {
  const theme = useTheme();
  return (
    <ListItem key={result.id}>
      <ListItemText
        primaryTypographyProps={{
          style: {
            color:
              result.resultType === ResultType.None
                ? theme.palette.text.disabled
                : theme.palette.text.primary,
          },
        }}
      >
        {result.name}
      </ListItemText>
    </ListItem>
  );
}

function ResultList({ results }: { results: Result[] }) {
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
