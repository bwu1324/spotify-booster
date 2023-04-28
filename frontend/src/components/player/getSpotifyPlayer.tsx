import * as React from 'react';
import {
  getDataFromLocalStorage,
  checkLocalStorageData,
  saveDataToLocalStorage,
} from '../util';

export let playbackPosition: any;

/**
 * Waits for the Spotify Web Playback SDK to load.
 */
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

/**
 * Retrieves the Spotify player and sets up event listeners.
 *
 * @param cookie The Spotify OAuth token.
 * @param setSpotifyPlayer Function to set the Spotify player instance.
 * @param setDeviceId Function to set the device ID.
 */
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

    // Start checking the player state every second
    setInterval(() => {
      player.getCurrentState().then((state: any) => {
        if (state) {
          // const currentTrackName = state.track_window.current_track.name;
          const currentTrackId = state.track_window.current_track.id;

          if (
            checkLocalStorageData('tracks') &&
            checkLocalStorageData('current_mashup') &&
            state.paused == false
          ) {
            const current_playing_mashup = getDataFromLocalStorage('tracks');
            const current_mashup_prop =
              getDataFromLocalStorage('current_mashup');

            // console.log('Current track:', currentTrackId);

            for (const [key, value] of Object.entries<Record<string, unknown>>(
              current_playing_mashup
            )) {
              const trackId = (value as any).track_id;
              if (trackId === currentTrackId) {
                const startMs = (value as any).start_ms;
                const startPosition = (value as any).start_position;

                // console.log(state.position);
                // Calculate the updated playback position based on the state and stored data
                playbackPosition = Math.round(
                  ((startPosition + (state.position - startMs)) /
                    current_mashup_prop.total_length) *
                    100
                );

                // Exit the loop after finding a match
                break;
              }
            }
          }
        }
      });
    }, 100); // Run the interval every 1000ms (1 second)
  });

  player.addListener('not_ready', ({ device_id }: { device_id: any }) => {
    console.warn('Spotify player has gone offline.', device_id);
    setDeviceId(null);
  });

  if (!(await player.connect())) {
    console.error('Failed to connect the Spotify player.');
  }

  setSpotifyPlayer(player);
}

export default getSpotifyPlayer;
