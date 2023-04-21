import React from 'react';

import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Callback from './components/login/Callback';
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
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Router>
    </AccessTokenContext.Provider>
  );
}
