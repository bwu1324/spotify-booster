import * as React from 'react';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container/Container';
import IconButton from '@mui/material/IconButton';
import { PlayArrow, FastForward, FastRewind, Pause } from '@mui/icons-material';
import { useState } from 'react';

function PlaybackBar() {
  <script src="https://sdk.scdn.co/spotify-player.js"></script>;
  const progress = 10;
  const total = 20;

  const [clicked, setClicked] = useState<boolean>(false);
  return (
    <Container
      maxWidth="lg"
      style={{
        overflowY: 'auto', // scroll on overflow
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton>
          <FastRewind />
        </IconButton>
        <IconButton onClick={() => setClicked(!clicked)}>
          {clicked ? <PlayArrow /> : <Pause />}
        </IconButton>
        <IconButton>
          <FastForward />
        </IconButton>
      </Box>
      <LinearProgressWithTime current={progress} total={total} />
    </Container>
  );
}

function fancyTimeFormat(duration: number) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;

  return ret;
}

function LinearProgressWithTime(
  props: LinearProgressProps & { current: number; total: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${fancyTimeFormat(
          props.current
        )}`}</Typography>
      </Box>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={(100 * props.current) / props.total}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${fancyTimeFormat(
          props.total
        )}`}</Typography>
      </Box>
    </Box>
  );
}

export default PlaybackBar;
