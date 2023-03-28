import * as React from 'react';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

function LinearProgressWithTime(current: number, total: number) {
  current = 4;
  total = 10;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${fancyTimeFormat(
          current
        )}`}</Typography>
      </Box>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={(100 * current) / total} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${fancyTimeFormat(
          total
        )}`}</Typography>
      </Box>
    </Box>
  );
}

function PlaybackBar() {
  const progress = 10;
  const total = 20;
  return (
    <div
      style={{
        overflowY: 'auto', // scroll on overflow
      }}
    >
      <LinearProgressWithTime current={progress} total={total} />
    </div>
  );
}

export default PlaybackBar;
