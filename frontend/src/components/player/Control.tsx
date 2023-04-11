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
import { CookieContext, Result } from '../util';
import spotify_config from '../../config/spotify_config.js';
import axios from 'axios';
import getSpotifyPlayer from './getSpotifyPlayer';

/**
 * The Control component is a container for the music player, which has the song
 * title of the current song, and the progress bar with playback controls.
 *
 * @param tracks List of tracks in the mashup.
 * @param currentTrack The index of the current track in the mashup. Null if no
 * track should be playing.
 * @param updateCurrentTrack A function to update the current track state in the
 * parent.
 */
export default function Control({
  tracks,
  currentTrack,
  updateCurrentTrack,
}: {
  tracks: Array<Result>;
  currentTrack: number | null;
  updateCurrentTrack: Function;
}) {
  // albumColPortion is the portion of the ControllerPaper container that is
  // allocated to the album art
  const [albumColPortion, setAlbumColPortion] = useState(0);

  // outerRef is a reference to the ControllerPaper container
  // it is for us to know the dimension of the first Grid container
  const outerRef = useRef<any>();

  // Spotify authentication token
  const cookie = useContext(CookieContext);

  // Spotify player SDK
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null
  );
  // The Spotify ID for the web player. Null iff the web player is offline.
  const [deviceId, setDeviceId] = useState<string | null>(null);
  // Whether music is currently not playing.
  const [paused, setPaused] = useState<boolean>(true);

  const spotifyHTTP = axios.create({
    baseURL: spotify_config.baseURL,
    headers: { Authorization: `Bearer ${cookie}` },
  });

  useEffect(() => {
    if (!outerRef.current) return; // wait for the elementRef to be available
    const resizeObserver = new ResizeObserver(() => {
      // The following actions will be called every time the element is resized
      setAlbumColPortion(
        parseFloat(
          (
            ((outerRef.current.clientHeight - 32) /
              (outerRef.current.clientWidth - 32)) *
            100
          ).toFixed(4)
        )
      );
    });
    resizeObserver.observe(outerRef.current);
    return () => {
      // clean up
      resizeObserver.disconnect();
    };
  });

  // Prepare the Spotify player SDK.
  useEffect(() => {
    if (cookie === null) return;
    getSpotifyPlayer(cookie, setSpotifyPlayer, setDeviceId);
    spotifyHTTP.defaults.headers.Authorization = `Bearer ${cookie}`;
  }, [cookie]);

  // Handle when the current track changes.
  useEffect(() => {
    // If we have a valid song that we can play...
    if (deviceId === null) return;
    if (currentTrack !== null) {
      // Send request to Spotify to play the song.
      spotifyHTTP.put(
        'me/player/play',
        { uris: [tracks[currentTrack].id] },
        { params: { device_id: deviceId } }
      );
      // Mark that the song is playing.
      setPaused(false);
    } else {
      spotifyHTTP.put('me/player/pause');
    }
  }, [currentTrack, spotifyPlayer]);

  /**
   * Skip to the next track. If we are at the end of the list, go back to the
   * beginning.
   */
  function nextTrack() {
    if (tracks.length !== 0 && currentTrack !== null) {
      updateCurrentTrack((currentTrack + 1) % tracks.length);
    }
  }

  /**
   * Skip to the previous track. If we are at the beginning of the list, go to
   * the end.
   */
  function prevTrack() {
    if (tracks.length !== 0 && currentTrack !== null) {
      updateCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length);
    }
  }

  /**
   * Flip whether the music is playing or not. (Given that there is something to
   * be played.)
   */
  function togglePaused() {
    if (deviceId !== null && currentTrack !== null) {
      if (paused) {
        spotifyHTTP.put('me/player/play');
      } else {
        spotifyHTTP.put('me/player/pause');
      }
      setPaused(!paused);
    }
  }

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
          <Typography variant="h6">
            {currentTrack !== null
              ? tracks[currentTrack].name
              : 'No Song Selected'}
          </Typography>
          <Typography variant="subtitle1">Artist Name</Typography>

          <PlaybackBar
            prevTrack={prevTrack}
            nextTrack={nextTrack}
            paused={paused}
            togglePaused={togglePaused}
          />
        </Grid>
      </Grid>
    </ControllerContainer>
  );
}
