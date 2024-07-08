import React from 'react';

import './App.scss';

import Home from './components/Home';
import { getCookie } from './components/login/Cookie';
import { AccessTokenContext } from './components/util';

export default function App() {
  const [spotifyAccessToken, setSpotifyAccessToken] = React.useState<
    string | null
  >(getCookie('spotify_access_token'));

  return (
    <AccessTokenContext.Provider
      value={{ token: spotifyAccessToken, setToken: setSpotifyAccessToken }}
    >
      <Home />
    </AccessTokenContext.Provider>
  );
}
