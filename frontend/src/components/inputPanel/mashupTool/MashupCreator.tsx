import { Button, Divider, TextField, Typography } from '@mui/material';
import React from 'react';
import { EmptyResult, Result, ResultType } from '../util';

function getMashupNameError(name: string | null) {
  if (name === null) return '';
  if (name.length === 0) return 'Name cannot be empty.';
  if (name.length > 50) return 'Name cannot be longer than 50 characters.';
  if (name.includes(' ')) return 'Name cannot contain spaces.';
  if (name.includes('/') || name.includes('\\'))
    return 'Name cannot contain slashes.';
  if (name.includes(':')) return 'Name cannot contain colons.';
  if (name.includes('*')) return 'Name cannot contain asterisks.';
  if (name.includes('?')) return 'Name cannot contain question marks.';
  if (name.includes("'")) return 'Name cannot contain single quotes.';
  if (name.includes('"')) return 'Name cannot contain double quotes.';
  if (name.includes('<')) return 'Name cannot contain less than signs.';
  if (name.includes('>')) return 'Name cannot contain greater than signs.';
  if (name.includes('|')) return 'Name cannot contain pipes.';
  if (name.includes('.')) return 'Name cannot contain periods.';
  if (name.includes(',')) return 'Name cannot contain commas.';
  if (name.includes(';')) return 'Name cannot contain semicolons.';
  if (name.includes('#')) return 'Name cannot contain hashtags.';
  if (name.includes('@')) return 'Name cannot contain at signs.';
  if (name.includes('$')) return 'Name cannot contain dollar signs.';
  if (name.includes('%')) return 'Name cannot contain percent signs.';
  if (name.includes('^')) return 'Name cannot contain caret signs.';
  if (name.includes('&')) return 'Name cannot contain ampersands.';
  if (name.includes('(')) return 'Name cannot contain left parentheses.';
  if (name.includes(')')) return 'Name cannot contain right parentheses.';
  if (name.includes('[')) return 'Name cannot contain left brackets.';
  if (name.includes(']')) return 'Name cannot contain right brackets.';
  if (name.includes('{')) return 'Name cannot contain left braces.';
  if (name.includes('}')) return 'Name cannot contain right braces.';
  if (name.includes('=')) return 'Name cannot contain equals signs.';
  if (name.includes('+')) return 'Name cannot contain plus signs.';
  return '';
}

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
  const [name, setName] = React.useState<string | null>(null);
  const nameError = getMashupNameError(name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <TextField
        label="Mashup Name"
        variant="standard"
        size="small"
        onChange={(event) => setName(event.target.value)}
        error={nameError.length !== 0}
        helperText={nameError ? nameError : ''}
      />
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
      {/* <Typography>Create a name for your mashup:</Typography> */}
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
          onClick={() => handleCreate(name)}
          sx={{ width: '50%' }}
          disabled={
            startSong === EmptyResult ||
            songRepo === EmptyResult ||
            name === null ||
            nameError.length !== 0
          }
        >
          Create
        </Button>
      </div>
    </div>
  );
}

export default MashupCreator;
