// Component for the header of the finder. Either a search bar or the title of
// the current mashup.

import React, { ReactElement, ReactNode } from 'react';
import {
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FinderView } from './Finder';
import CloseIcon from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

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

function SearchBar({ handleViewChange }: { handleViewChange: () => void }) {
  return (
    <div style={{ padding: '6px' }}>
      <TextField
        label="Search Spotify"
        fullWidth={true}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SideButton
                icon={<CloseIcon />}
                onClick={handleViewChange}
                title="Close search"
                ariaLabel="close"
              />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

function MashupHeader({
  mashupID,
  handleViewChange,
}: {
  mashupID: string;
  handleViewChange: () => void;
}) {
  const theme = useTheme();
  return (
    <>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center', // vertical alignment
          justifyContent: 'space-between', // put the search icon right
          margin: '13.5px', // line up with search view
        }}
      >
        <Typography
          aria-label="mashup title"
          color={theme.palette.secondary.main}
        >
          {mashupID}
        </Typography>
        <SideButton
          icon={<Search />}
          onClick={handleViewChange}
          title="Search"
          ariaLabel="search"
        />
      </div>
      <Divider />
    </>
  );
}

function SearchHeader({
  view,
  handleViewChange,
  mashupID,
}: {
  view: number;
  handleViewChange: Function;
  mashupID: string;
}) {
  const theme = useTheme();
  switch (view) {
    case FinderView.SEARCH:
      return (
        <SearchBar
          handleViewChange={() => handleViewChange(FinderView.MASHUP)}
        />
      );
    case FinderView.MASHUP:
      return (
        <MashupHeader
          mashupID={mashupID}
          handleViewChange={() => handleViewChange(FinderView.SEARCH)}
        />
      );
    default:
      return <></>;
  }
}

export default SearchHeader;
