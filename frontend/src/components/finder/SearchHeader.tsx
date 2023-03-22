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
import { Result, ResultType, resultTypeToString } from './util';

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

function getFilterButton(type: ResultType, updateSearchType: Function) {
  return (
    <FormControlLabel
      value={ResultType[type].toLowerCase()}
      key={ResultType[type].toLowerCase()}
      control={<Radio />}
      label={ResultType[type]}
      onClick={() => updateSearchType(type)}
    />
  );
}

function SearchFilter({
  query,
  searchType,
  updateSearchType,
  updateResults,
}: {
  query: string;
  searchType: ResultType;
  updateSearchType: Function;
  updateResults: Function;
}) {
  return (
    <div style={{ padding: '6px' }}>
      <FormControl>
        <RadioGroup
          value={resultTypeToString(searchType).toLowerCase()}
          row
          aria-label="search-filter-buttons"
          name="search-filter-radio-buttons-group"
          // onChange={async (newType) => {
          //   console.log(newType);
          //   await updateSearchType(newType);
          //   updateResults(await searchSpotifyFor(query, newType));
          // }}
        >
          {Array.from(Array(5).keys()).map((searchType) =>
            getFilterButton(searchType, updateSearchType)
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

function SearchBar({
  query,
  searchType,
  handleViewChange,
  updateQuery,
  updateResults,
}: {
  query: string;
  searchType: ResultType;
  handleViewChange: () => void;
  updateQuery: Function;
  updateResults: Function;
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
              onClick={handleViewChange}
              title="Close search"
              ariaLabel="close"
            />
          </InputAdornment>
        ),
      }}
    />
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
    </>
  );
}

function SearchHeader({
  view,
  query,
  searchType,
  handleViewChange,
  updateQuery,
  updateSearchType,
  updateResults,
  mashupID,
}: {
  view: number;
  query: string;
  searchType: ResultType;
  handleViewChange: Function;
  updateQuery: Function;
  updateSearchType: Function;
  updateResults: Function;
  mashupID: string;
}) {
  switch (view) {
    case FinderView.SEARCH:
      return (
        <div style={{ padding: '6px' }}>
          <SearchBar
            query={query}
            searchType={searchType}
            handleViewChange={() => handleViewChange(FinderView.MASHUP)}
            updateQuery={updateQuery}
            updateResults={updateResults}
          />
          <SearchFilter
            query={query}
            searchType={searchType}
            updateSearchType={updateSearchType}
            updateResults={updateResults}
          />
        </div>
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
