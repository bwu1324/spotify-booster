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
    console.debug('Spotify player ready with ID', device_id);
    setDeviceId(device_id);
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
