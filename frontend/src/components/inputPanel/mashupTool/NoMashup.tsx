/**
 * This file contains the NoMashup component, which is shown when the user when
 * there is mashup selected. It gives the option to the user to create a new
 * mashup.
 */
import { Button, Typography } from '@mui/material';

function NoMashup({ handleCreateNew }: { handleCreateNew: () => any }) {
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
