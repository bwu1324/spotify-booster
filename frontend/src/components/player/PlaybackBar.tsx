import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container/Container';
import IconButton from '@mui/material/IconButton';
import { PlayArrow, FastForward, FastRewind, Pause } from '@mui/icons-material';
import { playbackPosition } from './getSpotifyPlayer';
import { useState, useEffect } from 'react';

/**
 * The playback bar shows a progress bar of how much is left on the current
 * track, as well as the ability to play/pause and skip tracks.
 *
 * @param prevTrack Function to go to the previous track.
 * @param nextTrack Function to go to the next track.
 * @param paused Whether the music is paused or not.
 * @param togglePaused Function to toggle whether the music is paused or not.
 */
function PlaybackBar({
  prevTrack,
  nextTrack,
  paused,
  togglePaused,
}: {
  prevTrack: () => any;
  nextTrack: () => any;
  paused: boolean;
  togglePaused: () => any;
}) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Perform the logic to update the sharedVariable here
      setPosition(playbackPosition);
    }, 100);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once

  return (
    <Container
      maxWidth="lg"
      style={{
        overflowY: 'auto', // scroll on overflow
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={() => prevTrack()}>
          <FastRewind />
        </IconButton>
        <IconButton onClick={() => togglePaused()}>
          {paused ? <PlayArrow /> : <Pause />}
        </IconButton>
        <IconButton onClick={() => nextTrack()}>
          <FastForward />
        </IconButton>
      </Box>
      <LinearProgressWithTime current={position} />
    </Container>
  );
}

function LinearProgressWithTime(
  props: LinearProgressProps & { current: number }
) {
  const progress = Math.min(Math.max(props.current, 0), 100); // Ensure progress is within the 0-100 range

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </Box>
  );
}

export default PlaybackBar;
