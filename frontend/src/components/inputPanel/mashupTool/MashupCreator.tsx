import React from 'react';
import { Button, Divider, TextField, Typography } from '@mui/material';
import { EmptyResult, Result } from '../../util';

/**
 * This function validates the name of a mashup. We can't just use an array of
 * invalid characters, because different name issues should give different error
 * text.
 *
 * @param name Current mashup name.
 * @returns Error message if there is an error, empty string otherwise.
 */
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

/**
 * Show the currently selcted mashup setting (start song or song repo).
 * Separate function to prevent code duplication.
 *
 * @param setting The currently selected mashup setting.
 * @param unset_str The string to display if the setting is not yet set.
 * @param set_str The string to display if the setting is set.
 */
function getMashupSetting(
  setting: Result,
  unset_str: string,
  set_str: string
): JSX.Element {
  if (setting === EmptyResult) {
    return <Typography>{unset_str}</Typography>;
  }

  return (
    <Typography>
      <b>{set_str}</b>
      <span style={{ marginLeft: '16px' }}>{setting.name}</span>
    </Typography>
  );
}

function MashupCreator({
  startSong,
  songRepo,
  handleCancel,
  handleResetInputs,
  handleCreate,
}: {
  startSong: Result;
  songRepo: Result;
  handleCancel: () => any;
  handleResetInputs: () => any;
  handleCreate: (name: string) => any;
}) {
  // The currently set mashup name.
  const [name, setName] = React.useState<string | null>(null);
  // If the name is invalid, this will contain the error message.
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
      {getMashupSetting(
        startSong,
        'Choose a song with the search box.',
        'Start song: '
      )}
      {getMashupSetting(
        songRepo,
        'Choose a song repository with the search box.',
        'Song repository: '
      )}
      <Divider />
      <div
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleCancel()}
          sx={{ width: '33.33333%' }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleResetInputs()}
          sx={{ width: '33.33333%' }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleCreate(name ? name : '')}
          sx={{ width: '33.33333%' }}
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
