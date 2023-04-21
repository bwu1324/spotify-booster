import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ResultType } from '../../util';

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

export default SearchFilter;
