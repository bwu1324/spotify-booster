// Component for the header of the finder. Either a search bar or the title of
// the current mashup.

import React from 'react';
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
        <div style={{ padding: '6px' }}>
          <TextField
            label="Search Spotify"
            fullWidth={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Close search" placement="top">
                    <IconButton
                      onClick={() => handleViewChange(FinderView.MASHUP)}
                      edge="end"
                      color="secondary"
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </div>
      );
    case FinderView.MASHUP:
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
            <Tooltip title="Search" placement="top">
              <IconButton
                onClick={() => handleViewChange(FinderView.SEARCH)}
                edge="end"
                color="secondary"
                aria-label="search"
              >
                <Search />
              </IconButton>
            </Tooltip>
          </div>
          <Divider />
        </>
      );
    default:
      return <></>;
  }
}

export default SearchHeader;
