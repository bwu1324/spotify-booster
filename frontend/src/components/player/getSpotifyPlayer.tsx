import * as React from 'react';

interface PlaybackData {
  duration: number;
  position: number;
}

const playbackData: PlaybackData = { duration: 0, position: 0 };

async function waitForSpotifyWebPlaybackSDKToLoad() {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve(window.Spotify);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(window.Spotify);
      };
    }
  });
}

async function getSpotifyPlayer(
  cookie: string,
  setSpotifyPlayer: Function,
  setDeviceId: Function
) {
  // Attatch the SDK.
  const script = document.createElement('script');
  script.src = 'https://sdk.scdn.co/spotify-player.js';
  script.async = true;
  document.body.appendChild(script);

  // Wait for the SDK to load.
  await waitForSpotifyWebPlaybackSDKToLoad();

  const player = new window.Spotify.Player({
    // This is the name that will show up in Spotify Connect.
    name: 'Spotify Booster',
    getOAuthToken: (cb: Function) => {
      cb(cookie);
    },
    volume: 0.5,
  });

  player.addListener('ready', ({ device_id }: { device_id: any }) => {
    console.debug('Spotify player ready with Device ID', device_id);
    setDeviceId(device_id);
  });

  player.addListener('not_ready', ({ device_id }: { device_id: any }) => {
    console.warn('Spotify player has gone offline.', device_id);
    setDeviceId(null);
  });

  // Add a listener to the player_state_changed event
  player.addListener('player_state_changed', () => {
    // Call the getCurrentState method to get the WebPlaybackState object
    player.getCurrentState().then((state) => {
      if (state) {
        playbackData.duration = state.duration;
        playbackData.position = state.position;
        // Access the duration and position properties to get the time played
        // console.log(`Time played: ${position} milliseconds`);
        // console.log(`Duration: ${duration} milliseconds`);
        // Calculate the time remaining for the current track
        // console.log(`Time remaining: ${duration - position} milliseconds`);
      }
    });
  });

  if (!(await player.connect())) {
    console.error('Failed to connect the Spotify player.');
  }

  setSpotifyPlayer(player);
}

export { playbackData };
export default getSpotifyPlayer;
