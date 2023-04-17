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

import React, { useContext } from 'react';
import { Paper } from '@mui/material';
import { theme } from '../../../theme';
import NoMashup from './NoMashup';
import MashupCreator from './MashupCreator';
import MashupInfo from './MashupInfo';
import { MashupContext, Result, ResultType } from '../../util';
import { EmptyResult, MashupInCreation, backendHTTP } from '../../util';

/**
 * MashupToolContent is a wrapper for the MashupTool screens. We need it to
 * be able to conditionally return each of the different views. There isn't an
 * elegant way to do this otherwise.
 */
function MashupToolContent({
  startSong,
  songRepo,
  resetResults,
  resetMashupParams,
}: {
  startSong: Result;
  songRepo: Result;
  resetResults: Function;
  resetMashupParams: Function;
}) {
  const { mashup, setMashup } = useContext(MashupContext);

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
      backendHTTP
        .post('mashupapi/createMashup', null, { params: { name: name } })
        .then((response) => {
          // console.log(response);
          const newMashup = {
            resultType: ResultType.Mashup,
            id: response.data.mashup_id,
            name: name,
          };
          // Set the mashup ID to rerender correctly.
          setMashup(newMashup);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function deleteCurrentMashup() {
    if (mashup.resultType !== ResultType.Mashup) {
      console.error('No mashup selected.');
      return;
    }

    // Delete the mashup with the API.
    backendHTTP
      .delete('mashupapi/deleteMashup', {
        params: { mashup_id: mashup.id },
      })
      .catch(() => {
        console.error('Error deleting mashup.');
      })
      .then(() => {
        // Reset the result list so that the deleted mashup doesn't show up.
        resetResults();
      });

    // Set the mashup to empty.
    setMashup(EmptyResult);
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
        handleResetInputs={resetMashupParams} // doesn't do anything yet, need to implement
        handleCreate={createMashup}
      />
    );
  } else {
    return (
      // If we have a mashup selected, show the MashupInfo screen.
      <MashupInfo
        mashup={mashup}
        handleClose={() => setMashup(EmptyResult)}
        handleDelete={deleteCurrentMashup}
      />
    );
  }
}

/**
 * Uses the MashupToolContent wrapper to show the correct screen.
 */
function MashupTool({
  startSong,
  songRepo,
  resetResults,
  resetMashupParams,
}: {
  startSong: Result;
  songRepo: Result;
  resetResults: Function;
  resetMashupParams: Function;
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
      <MashupToolContent
        startSong={startSong}
        songRepo={songRepo}
        resetResults={resetResults}
        resetMashupParams={resetMashupParams}
      />
    </Paper>
  );
}

export default MashupTool;
