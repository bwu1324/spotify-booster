// Component for the list shown in the finder.

import React, { useContext } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { MashupContext, Result, ResultType } from '../../util';

// Used for rendering each result.
function RenderedResult({
  result,
  updateMashupParam,
}: {
  result: Result;
  updateMashupParam: Function;
}) {
  const setMashup = useContext(MashupContext).setMashup;
  return (
    <ListItem disablePadding>
      {result.resultType === ResultType.Artist ? (
        <ListItemText
          sx={{
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {result.name}
        </ListItemText>
      ) : (
        <ListItemButton
          onClick={() => {
            if (result.resultType === ResultType.Mashup) {
              setMashup(result);
            } else {
              updateMashupParam(result);
            }
          }}
          disabled={result.resultType === ResultType.None ? true : false}
        >
          <ListItemText>{result.name}</ListItemText>
        </ListItemButton>
      )}
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
