/**
 * This file contains the MashupInfo component, which is shown when the user has
 * selected a mashup. It shows details about the mashup, like its name.
 */

import React from 'react';
import { Button, Divider, Typography } from '@mui/material';
import { Result } from '../../util';

function MashupInfo({
  mashup,
  handleClose,
}: {
  mashup: Result;
  handleClose: Function;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Typography>
        <b>Selected Mashup: </b>
        {mashup.name}
      </Typography>
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
