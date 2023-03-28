import { Grid } from '@mui/material';
import React from 'react';
import Finder from './finder/Finder';
import MashupTool from './mashupTool/MashupTool';

function InputPanel() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <MashupTool />
      <Finder />
    </div>
  );
}

export default InputPanel;
