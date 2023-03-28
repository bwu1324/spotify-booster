import { Button, Typography } from '@mui/material';
import React from 'react';
import { theme } from '../../../theme';

function NoMashup({ handleCreateNew }: { handleCreateNew: Function }) {
  return (
    <Typography>
      <Button
        variant="text"
        color="secondary"
        onClick={() => handleCreateNew()}
      >
        Create new mashup
      </Button>
      or search for an existing one below.
    </Typography>
  );
}

export default NoMashup;
