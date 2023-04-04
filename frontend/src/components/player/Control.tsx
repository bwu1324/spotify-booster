/*  This file contains the entire code for the Control component.
    The Control component is a container for the music player, including the following elements:
    - album art
    - the song title/artist name
    - mash-up playing progress bar
    - mash-up playing controls (play/pause, skip, etc.)
    - mash-up remake
*/

import React, { useContext } from 'react';
import { useState, useEffect, useRef } from 'react';

import { Typography, Grid } from '@mui/material';
import { ControllerContainer, AlbumArt } from '../../theme';
import PlaybackBar from './PlaybackBar';
import { CookieContext, Result, spotifyHTTP } from '../util';

export default function Control({
  tracks,
  currentTrack,
  updateCurrentTrack,
}: {
  tracks: Array<Result>;
  currentTrack: Result | null;
  updateCurrentTrack: (track: Result) => void;
}) {
  // outerHeight and outerWidth are the height and width of the ControllerPaper container
  const [outerHeight, setOuterHeight] = useState(0);
  const [outerWidth, setOuterWidth] = useState(0);

  // albumColPortion is the portion of the ControllerPaper container that is allocated to the album art
  const [albumColPortion, setAlbumColPortion] = useState(0);

  // outerRef is a reference to the ControllerPaper container
  // it is for us to know the dimension of the first Grid container
  const outerRef = useRef<any>();

  const cookie = useContext(CookieContext);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null
  );
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (!outerRef.current) return; // wait for the elementRef to be available
    const resizeObserver = new ResizeObserver(() => {
      // The following actions will be called every time the element is resized
      setOuterHeight(outerRef.current.clientHeight);
      setOuterWidth(outerRef.current.clientWidth);
      setAlbumColPortion(
        parseFloat((((outerHeight - 32) / (outerWidth - 32)) * 100).toFixed(4))
      );
    });
    resizeObserver.observe(outerRef.current);
    return () => {
      // clean up
      resizeObserver.disconnect();
    };
  });

  useEffect(() => {
    console.log('Setting up Spotify Player SDK...');
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Spotify Booster',
        getOAuthToken: (cb: Function) => {
          cb(cookie);
        },
        volume: 1,
      });

      setSpotifyPlayer(player);
      setPlayerReady(true);

      console.log('Spotify Player SDK ready!');
    };
  }, []);

  useEffect(() => {
    if (playerReady && spotifyPlayer) {
      spotifyPlayer.addListener(
        'ready',
        ({ device_id }: { device_id: any }) => {
          console.log('Ready with Device ID', device_id);
        }
      );

      spotifyPlayer.addListener(
        'not_ready',
        ({ device_id }: { device_id: any }) => {
          console.log('Device ID has gone offline', device_id);
        }
      );

      spotifyPlayer.addListener(
        'player_state_changed',
        ({ position, duration, track_window: { current_track } }) => {
          console.log(position, duration, current_track);
        }
      );

      spotifyPlayer.connect();
    }
  }, [playerReady]);

  useEffect(() => {
    if (currentTrack && spotifyPlayer) {
      spotifyHTTP.put(
        'me/player/play',
        { uris: [currentTrack.id] },
        { params: { device_id: spotifyPlayer._options.id } }
      );
    }
  });

  // This function returns the Control component
  // ControllerContainer -> Grid -> Grid -> Typography
  return (
    <ControllerContainer>
      <Grid container p={2} height="100%" ref={outerRef}>
        <Grid
          height="100%"
          style={{
            // the following makes sure that the album art
            // doesn't have correct display when the parent container is not loaded yet
            flex: `0 0 ${
              albumColPortion == 0 || albumColPortion == 100
                ? 0
                : albumColPortion
            }%`,
          }}
          position="relative"
        >
          <AlbumArt
            // this src is a placeholder for the album art
            // @TODO: replace with actual album art, if available from Spotify's API or elsewhere
            src="https://i.ibb.co/Y0KTnFf/a4139357031-10.jpg"
          />
        </Grid>
        <Grid
          height="100%"
          style={{ flex: `0 0 ${100 - albumColPortion}%` }}
          sx={{ paddingLeft: 2 }}
        >
          <Typography variant="h6">Song Title</Typography>
          <Typography variant="subtitle1">Artist Name</Typography>

          <PlaybackBar spotifyPlayer={spotifyPlayer} />
        </Grid>
      </Grid>
    </ControllerContainer>
  );
}
