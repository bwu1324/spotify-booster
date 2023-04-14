import { getCookie, setCookie } from './Cookie';

import querystring from 'querystring';
import spotify_config from '../../config/spotify_config';

export async function RefreshToken(): Promise<void> {
  const spotify_refresh_token = getCookie('spotify_refresh_token');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(
          spotify_config.clientId + ':' + spotify_config.clientSec
        )}`,
      },
      body: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: spotify_refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // ¯\_(ツ)_/¯
    const data = await response.json();
    setCookie('spotify_access_token', data.access_token, 31);

    const now = Date.now();
    const expirationTime = now + data.expires_in * 1000;
    setCookie('spotify_access_token_expires_in', expirationTime.toString(), 31);

    if (getCookie('spotify_access_token') == data.access_token) {
      console.log('Access token refreshed!');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function checkTokenExpiration(): Promise<void> {
  const now = Date.now();
  // const date = new Date(now);
  // const utcString = date.toUTCString();

  const expirationTime = getCookie('spotify_access_token_expires_in');
  if (expirationTime !== null) {
    const expirationTimestamp = parseInt(expirationTime, 10);
    // const expirationDate = new Date(expirationTimestamp);
    // const expirationUTCString = expirationDate.toUTCString();

    // console.log(expirationUTCString, utcString, expirationTimestamp - now);

    // 5 minutes before expiration
    // 59 min = 3540000 ms, for debug use
    // 5 min = 300000 ms, for actual use
    if (expirationTimestamp - now < 300000) {
      console.warn('Token expired!');
      RefreshToken();
    }
  }
}
