import React from 'react';
import { Paper } from '@mui/material';
import { theme } from '../../../theme';
import NoMashup from './NoMashup';
import MashupCreator from './MashupCreator';
import MashupInfo from './MashupInfo';
import { Result, ResultType } from '../util';
import { EmptyResult } from '../util';

const MashupInCreation: Result = {
  resultType: ResultType.Mashup,
  id: '...',
  name: 'Mashup under Construction',
};

function MashupTool() {
  // Current mashup ID. '...' if a mashup is being created.
  const [mashup, setMashup] = React.useState<Result>(EmptyResult);
  const [view, setView] = React.useState(
    <NoMashup handleCreateNew={setCreateView} />
  );

  function createMashup(startSong: Result, songRepo: Result) {
    // TODO
    // Make sure we have a start song (track) and a song repo (playlist/album).
    // if (startSong.resultType !== ResultType.Track) {
    //   throw new Error('Start song must be a track.');
    // }
    // if (
    //   songRepo.resultType !== ResultType.Playlist ||
    //   songRepo.resultType !== ResultType.Album
    // ) {
    //   throw new Error('Song repository must be a playlist or album.');
    // }
    // Create new mashup with the API.
    // Set the mashup ID to rerender correctly.

    const newMashup = {
      resultType: ResultType.Mashup,
      id: '123',
      name: 'Mashup 123',
    };
    setMashup(newMashup);
    setView(<MashupInfo mashup={newMashup} handleClose={setNoMashupView} />);
  }

  function setNoMashupView() {
    setMashup(EmptyResult);
    setView(<NoMashup handleCreateNew={setCreateView} />);
  }

  function setCreateView() {
    setMashup(MashupInCreation);
    setView(
      <MashupCreator
        handleCancel={setNoMashupView}
        handleCreate={createMashup}
      />
    );
  }

  return (
    <Paper
      color={theme.palette.background.paper}
      sx={{
        maxHeight: '100%',
        display: 'flex', // Prevent the list from overflowing.
        flexDirection: 'column',
        padding: 1,
      }}
      // elevation={5}
    >
      {view}
    </Paper>
  );
}

export default MashupTool;
