import { Button, Divider, Typography } from '@mui/material';
import React from 'react';
import { EmptyResult, Result, ResultType } from '../util';

function MashupCreator({
  startSong,
  songRepo,
  handleCancel,
  handleCreate,
}: {
  startSong: Result;
  songRepo: Result;
  handleCancel: Function;
  handleCreate: Function;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {startSong === EmptyResult ? (
        <Typography>Choose a song with the search box.</Typography>
      ) : (
        <Typography>Start song: {startSong.name}</Typography>
      )}
      {songRepo === EmptyResult ? (
        <Typography>Choose a playlist/album with the search box.</Typography>
      ) : (
        <Typography>Song Repository: {songRepo.name}</Typography>
      )}
      <Divider />
      <div
        style={{
          display: 'flex',
          // flexDirection: 'row',
          gap: 10,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleCancel()}
          sx={{ width: '50%' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleCreate()}
          sx={{ width: '50%' }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default MashupCreator;
