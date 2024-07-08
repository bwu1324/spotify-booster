/*  This file contains the entire code for the Control component.
    The Control component is a container for the music player, including the following elements:
    - album art
    - the song title/artist name
    - mash-up playing progress bar
    - mash-up playing controls (play/pause, skip, etc.)
    - mash-up remake
    */

import { useContext } from 'react';
import { useState, useEffect, useRef } from 'react';

import { Typography, Grid } from '@mui/material';
import { ControllerContainer, AlbumArt } from '../../theme';
import PlaybackBar from './PlaybackBar';
import {
  AccessTokenContext,
  MashupSection,
  pauseSpotifyPlayback,
  playSpotifyPlayback,
  playSpotifyTrack,
} from '../util';
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
  mashupSections: mashupSections,
  currentTrack,
  updateCurrentTrack,
}: {
  mashupSections: Array<MashupSection>;
  currentTrack: number | null;
  updateCurrentTrack: (track: number) => any;
}) {
  // albumColPortion is the portion of the ControllerPaper container that is
  // allocated to the album art
  const [albumColPortion, setAlbumColPortion] = useState(0);

  // outerRef is a reference to the ControllerPaper container
  // it is for us to know the dimension of the first Grid container
  const outerRef = useRef<any>();

  // Spotify player SDK
  const [spotifyPlayer, setSpotifyPlayer] = useState<any | null>(
    null
  );
  // The Spotify ID for the web player. Null iff the web player is offline.
  const [deviceId, setDeviceId] = useState<string | null>(null);
  // Whether music is currently not playing.
  const [paused, setPaused] = useState<boolean>(true);

  const [shouldConsiderAutoplay, setShouldConsiderAutoplay] =
    useState<boolean>(false);

  const spotifyAccessToken = useContext(AccessTokenContext).token;

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
    if (spotifyAccessToken === null) return;

    getSpotifyPlayer(spotifyAccessToken, setSpotifyPlayer, setDeviceId);
  }, [spotifyAccessToken]);

  // Handle when the current track changes.
  useEffect(() => {
    // If we have a valid song that we can play...
    if (deviceId === null) return;
    if (currentTrack !== null) {
      // Send request to Spotify to play the song starting at the correct
      // position.
      playSpotifyTrack(
        mashupSections[currentTrack].track.id,
        deviceId,
        mashupSections[currentTrack].startMs
      );
      // Mark that the song is playing.
      setPaused(false);

      // Once we are done with this section of the song, consider autoplaying.
      // When the state is updated after the delay, a useEffect will reevaluate
      // whether to autoplay.
      setTimeout(
        () => setShouldConsiderAutoplay(true),
        mashupSections[currentTrack].endMs -
        mashupSections[currentTrack].startMs
      );
    } else {
      pauseSpotifyPlayback();
    }
  }, [currentTrack, spotifyPlayer]);

  useEffect(() => {
    if (shouldConsiderAutoplay === false) return;
    setShouldConsiderAutoplay(false); // Handle this notification.
    async function func() {
      if (spotifyPlayer === null || currentTrack === null) return;
      // Get where we are in the song via Spotify state.
      const state = await spotifyPlayer.getCurrentState();
      if (state === null || state === undefined) return;
      // Calculate how much time is left in this mashup section.
      const remaining =
        state.position === 0 // If we are at the end of the song.
          ? 0
          : mashupSections[currentTrack].endMs - state.position;
      // If we have completed this mashup section, go to the next track.
      if (remaining <= 0) {
        // Stop at the end of the mashup.
        if (currentTrack === mashupSections.length - 1) {
          updateCurrentTrack(0);
          setPaused(true);
        } else {
          nextTrack();
        }
      } else {
        setTimeout(() => setShouldConsiderAutoplay(true), remaining);
      }
    }
    func();
  }, [shouldConsiderAutoplay]);

  /**
   * Skip to the next track. If we are at the end of the list, go back to the
   * beginning.
   */
  function nextTrack() {
    if (mashupSections.length !== 0 && currentTrack !== null) {
      updateCurrentTrack((currentTrack + 1) % mashupSections.length);
    }
  }

  /**
   * Skip to the previous track. If we are at the beginning of the list, go to
   * the end.
   */
  function prevTrack() {
    if (mashupSections.length !== 0 && currentTrack !== null) {
      updateCurrentTrack(
        (currentTrack - 1 + mashupSections.length) % mashupSections.length
      );
    }
  }

  /**
   * Flip whether the music is playing or not. (Given that there is something to
   * be played.)
   */
  function togglePaused() {
    if (deviceId !== null && currentTrack !== null) {
      if (paused) {
        playSpotifyPlayback();
      } else {
        pauseSpotifyPlayback();
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
            // the following makes sure that the album art doesn't have correct
            // display when the parent container is not loaded yet
            flex: `0 0 ${albumColPortion == 0 || albumColPortion == 100
              ? 0
              : albumColPortion
              }%`,
          }}
          position="relative"
        >
          <AlbumArt
            // this src is a placeholder for the album art
            // @TODO: replace with actual album art, if available from Spotify's
            // API or elsewhere
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
              ? mashupSections[currentTrack].track.name
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
