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
  handleDelete,
}: {
  mashup: Result;
  handleClose: Function;
  handleDelete: Function;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Typography>
        <b>Selected Mashup: </b>
        {mashup.name}
      </Typography>
      <Divider />
      <div
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete()}
          sx={{ width: '50%' }}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleClose()}
          sx={{ width: '50%' }}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default MashupInfo;
