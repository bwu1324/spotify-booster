import React from 'react';
import { Paper } from '@mui/material';
import { theme } from '../../../theme';
import NoMashup from './NoMashup';
import MashupCreator from './MashupCreator';
import MashupInfo from './MashupInfo';
import { Result, ResultType } from '../util';
import { EmptyResult } from '../util';
import axios from 'axios';
import backend_config from '../../../config/backend_config.js';

const MashupInCreation: Result = {
  resultType: ResultType.Mashup,
  id: '...',
  name: 'Mashup under Construction',
};

function MashupToolContent({
  startSong,
  songRepo,
}: {
  startSong: Result;
  songRepo: Result;
}) {
  // Current mashup ID. '...' if a mashup is being created.
  const [mashup, setMashup] = React.useState<Result>(EmptyResult);

  async function createMashup(name: string) {
    // TODO
    // Make sure we have a start song (track) and a song repo (playlist/album).
    if (startSong.resultType !== ResultType.Track) {
      throw new Error('Start song must be a track.');
    }
    if (
      songRepo.resultType !== ResultType.Playlist &&
      songRepo.resultType !== ResultType.Album
    ) {
      throw new Error('Song repository must be a playlist or album.');
    }
    // Create new mashup with the API.

    // axios.post(backend_config.base_url + 'remixapi/createRemix', {name: });

    // Set the mashup ID to rerender correctly.
    const newMashup = {
      resultType: ResultType.Mashup,
      id: '123',
      name: name,
    };
    setMashup(newMashup);
  }

  if (mashup === EmptyResult) {
    return <NoMashup handleCreateNew={() => setMashup(MashupInCreation)} />;
  } else if (mashup === MashupInCreation) {
    return (
      <MashupCreator
        startSong={startSong}
        songRepo={songRepo}
        handleCancel={() => setMashup(EmptyResult)}
        handleCreate={createMashup}
      />
    );
  } else {
    return (
      <MashupInfo mashup={mashup} handleClose={() => setMashup(EmptyResult)} />
    );
  }
}

function MashupTool({
  startSong,
  songRepo,
}: {
  startSong: Result;
  songRepo: Result;
}) {
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
      <MashupToolContent startSong={startSong} songRepo={songRepo} />
    </Paper>
  );
}

export default MashupTool;
