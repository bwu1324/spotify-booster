// This file contains the entire code for the Header component.

import SpotifyLogin from './login/Login';
import { AppBar, Link, Toolbar } from '@mui/material';

export default function Header() {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" underline="none" color="secondary">
          <b>Spotify Booster</b>
        </Link>
        <SpotifyLogin />
      </Toolbar>
    </AppBar>
  );
}
