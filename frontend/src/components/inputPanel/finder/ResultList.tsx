// Component for the list shown in the finder.

import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
} from '@mui/material';
import { Result, ResultType } from '../../util';

// Used for rendering each result.
function RenderedResult({
  result,
  updateMashupParam,
}: {
  result: Result;
  updateMashupParam: Function;
}) {
  const theme = useTheme();
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          updateMashupParam(result);
        }}
      >
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
      </ListItemButton>
    </ListItem>
  );
}

function ResultList({
  results,
  updateMashupParam,
}: {
  results: Result[];
  updateMashupParam: Function;
}) {
  if (results.length === 0) {
    return <></>;
  }
  return (
    <div
      style={{
        overflowY: 'auto', // scroll on overflow
        margin: 0,
      }}
    >
      <Divider />
      <List>
        {results.map((result) => (
          <RenderedResult
            result={result}
            updateMashupParam={updateMashupParam}
            key={result.id}
          />
        ))}
      </List>
    </div>
  );
}

export default ResultList;
