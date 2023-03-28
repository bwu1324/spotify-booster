import { Grid } from '@mui/material';
import React from 'react';
import Finder from './finder/Finder';
import MashupTool from './mashupTool/MashupTool';
import { EmptyResult, Result, ResultType } from './util';

function InputPanel() {
  const [startSong, setStartSong] = React.useState<Result>(EmptyResult);
  const [songRepo, setSongRepo] = React.useState<Result>(EmptyResult);

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
