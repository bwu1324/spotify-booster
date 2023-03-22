// Component for the header of the finder. Either a search bar or the title of
// the current mashup.

import React, { ReactElement, useEffect, useState } from 'react';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FinderView } from './Finder';
import CloseIcon from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { searchSpotifyFor } from './SpotifySearch';
import { ResultType, resultTypeToString } from './util';

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

function FilterButton({
  type,
  updateSearchType,
}: {
  type: ResultType;
  updateSearchType: Function;
}) {
  return (
    <FormControlLabel
      value={resultTypeToString(type).toLowerCase()}
      control={<Radio />}
      label={resultTypeToString(type)}
      onClick={() => updateSearchType(type)}
    />
  );
}

function SearchFilter({ updateSearchType }: { updateSearchType: Function }) {
  return (
    <div style={{ padding: '6px' }}>
      <FormControl>
        <RadioGroup
          defaultValue="track"
          row
          aria-label="search-filter-buttons"
          name="search-filter-radio-buttons-group"
        >
          <FilterButton
            type={ResultType.TRACK}
            updateSearchType={updateSearchType}
          />
          <FilterButton
            type={ResultType.ARTIST}
            updateSearchType={updateSearchType}
          />
          <FilterButton
            type={ResultType.ALBUM}
            updateSearchType={updateSearchType}
          />
          <FilterButton
            type={ResultType.PLAYLIST}
            updateSearchType={updateSearchType}
          />
          <FilterButton
            type={ResultType.MASHUP}
            updateSearchType={updateSearchType}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

function SearchBar({
  handleViewChange,
  updateResultsCallback,
}: {
  handleViewChange: () => void;
  updateResultsCallback: Function;
}) {
  const [searchType, setSearchType] = useState(ResultType.TRACK);
  const [query, setQuery] = useState('');

  useEffect(() => {
    updateResultsCallback([]);
    const updateAsync = async () => {
      updateResultsCallback(await searchSpotifyFor(query, searchType));
    };

    updateAsync().catch(console.error);
  }),
    [query, searchType];

  return (
    <div style={{ padding: '6px' }}>
      <TextField
        label="Search"
        fullWidth={true}
        onChange={async (event) => setQuery(event.target.value)}
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
      <SearchFilter updateSearchType={setSearchType} />
      <Divider />
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
  updateResultsCallback,
  mashupID,
}: {
  view: number;
  handleViewChange: Function;
  updateResultsCallback: Function;
  mashupID: string;
}) {
  switch (view) {
    case FinderView.SEARCH:
      return (
        <SearchBar
          handleViewChange={() => handleViewChange(FinderView.MASHUP)}
          updateResultsCallback={updateResultsCallback}
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
