/**
 * This component is the parent of the Finder and MashupTool components. It
 * needs to exist so that the Finder and MashupTool components can share state.
 *
 * When the user clicks on a result in the Finder component, the Finder
 * component calls the updateMashupParam function to set the seed parameters for
 * creating a mashup.
 */

import React from 'react';
import Finder from './finder/Finder';
import MashupTool from './mashupTool/MashupTool';
import { EmptyResult, Result, ResultType } from './util';

function InputPanel() {
  // The start song is the song that the mashup will start with.
  const [startSong, setStartSong] = React.useState<Result>(EmptyResult);
  // The song repo is the album/playlist that the mashup will draw songs from.
  const [songRepo, setSongRepo] = React.useState<Result>(EmptyResult);

  // Updates state if input is valid. (e.g. startSong cannot be an album)
  function handleNewMashupParam(param: Result) {
    if (param.resultType === ResultType.Track) {
      setStartSong(param);
    } else if (
      param.resultType === ResultType.Album ||
      param.resultType === ResultType.Playlist
    ) {
      setSongRepo(param);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <MashupTool startSong={startSong} songRepo={songRepo} />
      <Finder updateMashupParam={handleNewMashupParam} />
    </div>
  );
}

export default InputPanel;
