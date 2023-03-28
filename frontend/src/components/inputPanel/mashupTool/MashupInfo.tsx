import { Button, Divider, Typography } from '@mui/material';
import React from 'react';
import { Result } from '../util';

function MashupInfo({
  mashup,
  handleClose,
}: {
  mashup: Result;
  handleClose: Function;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Typography>{mashup.name}</Typography>
      <Divider />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleClose()}
      >
        Close Mashup
      </Button>
    </div>
  );
}

export default MashupInfo;
