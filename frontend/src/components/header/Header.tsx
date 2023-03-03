import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';

function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Spotify Booster
        <Button variant="contained" color="secondary">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
