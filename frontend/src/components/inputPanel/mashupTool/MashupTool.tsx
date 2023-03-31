/**
 * This file contains the MashupTool component, which is responsible for the
 * creation and management of mashups.
 *
 * It starts showing the NoMashup component,
 * which allows the user to start the mashup creation process. Then it shows the
 * MashupCreator component, which allows the user to create a new mashup by
 * selecting start parameters. After the user has created a mashup, it shows the
 * MashupInfo component, which shows details about the mashup, like its name and
 * songs.
 */

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

/**
 * MashupToolContent is a wrapper for the MashupTool screens. We need it to
 * be able to conditionally return each of the different views. There isn't an
 * elegant way to do this otherwise.
 */
function MashupToolContent({
  startSong,
  songRepo,
}: {
  startSong: Result;
  songRepo: Result;
}) {
  // Current mashup ID. '...' if a mashup is in the creation process.
  const [mashup, setMashup] = React.useState<Result>(EmptyResult);

  async function createMashup(name: string) {
    // Make sure we have a start song (track) and a song repo (playlist/album).
    if (startSong.resultType !== ResultType.Track) {
      console.error('Start song must be a track.');
    }
    if (
      songRepo.resultType !== ResultType.Playlist &&
      songRepo.resultType !== ResultType.Album
    ) {
      console.error('Song repository must be a playlist or album.');
    }

    // Create new mashup with the API.
    try {
      axios
        .post(
          backend_config.base_url + 'remixapi/createRemix',
          { headers: { Cookie: 'spotify_access_token=abc;' } },
          {
            params: { name: name },
          }
        )
        .then((response) => {
          // console.log(response);
          const newMashup = {
            resultType: ResultType.Mashup,
            id: response.data.remix_id,
            name: name,
          };
          // Set the mashup ID to rerender correctly.
          setMashup(newMashup);
        });
    } catch (error) {
      console.error(error);
    }
  }

  // Decide which screen to show.
  if (mashup === EmptyResult) {
    // If we don't have a mashup selected, show the NoMashup screen.
    return <NoMashup handleCreateNew={() => setMashup(MashupInCreation)} />;
  } else if (mashup === MashupInCreation) {
    // If we're creating a new mashup, show the MashupCreator screen.
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
      // If we have a mashup selected, show the MashupInfo screen.
      <MashupInfo mashup={mashup} handleClose={() => setMashup(EmptyResult)} />
    );
  }
}

/**
 * Uses the MashupToolContent wrapper to show the correct screen.
 */
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
    >
      <MashupToolContent startSong={startSong} songRepo={songRepo} />
    </Paper>
  );
}

export default MashupTool;
