// Component for the header of the finder. Either a search bar or the title of
// the current mashup.

import React, { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import {
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FinderView } from './Finder';
import { ResultType } from '../../util';

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

// Return a radio button for filtering search results.
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

// Button group of radio button search filters.
function SearchFilter({
  searchType,
  updateSearchType,
}: {
  searchType: ResultType;
  updateSearchType: Function;
}) {
  return (
    <div style={{ padding: '6px' }}>
      <FormControl>
        <RadioGroup
          value={ResultType[searchType].toLowerCase()}
          row
          aria-label="search-filter-buttons"
          name="search-filter-radio-buttons-group"
        >
          {
            // Radio button for each of the first 5 SearchType variants.
            Array.from(Array(5).keys()).map((searchType) =>
              getFilterButton(searchType, updateSearchType)
            )
          }
        </RadioGroup>
      </FormControl>
    </div>
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
  mashupID,
}: {
  view: number;
  query: string;
  searchType: ResultType;
  handleViewChange: Function;
  updateQuery: Function;
  updateSearchType: Function;
  mashupID: string;
}) {
  switch (view) {
    case FinderView.SEARCH:
      return (
        <div style={{ padding: '6px' }}>
          <SearchBar query={query} updateQuery={updateQuery} />
          <SearchFilter
            searchType={searchType}
            updateSearchType={updateSearchType}
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
