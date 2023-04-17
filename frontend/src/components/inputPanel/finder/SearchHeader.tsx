// Component for the header of the finder. Either a search bar or the title of
// the current mashup.

import React, { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';

// Reusable button component for the side of the search bar, etc.
function SideButton({
  icon,
  onClick,
  title,
  ariaLabel,
}: {
  icon: ReactElement;
  onClick: () => void;
  title: string;
  ariaLabel?: string;
}) {
  return (
    <Tooltip title={title} placement="top">
      <IconButton
        onClick={onClick}
        edge="end"
        color="secondary"
        aria-label={ariaLabel}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

function SearchBar({
  query,
  updateQuery,
}: {
  query: string;
  updateQuery: Function;
}) {
  return (
    <TextField
      label="Search"
      value={query}
      fullWidth={true}
      onChange={(event) => {
        updateQuery(event.target.value);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SideButton
              icon={<CloseIcon />}
              onClick={() => updateQuery('')}
              title="Clear search"
              ariaLabel="clear"
            />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchBar;
