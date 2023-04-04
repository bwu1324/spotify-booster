// This file contains the entire code for the TrackList component.
// The TrackList component is a container for the list of tracks in the mash-up.

import React from 'react';

import { TrackListContainer } from '../../theme';
import { Result } from '../util';
import { List, ListItem, ListItemText, useTheme } from '@mui/material';

/**
 * Renders a single track in the list, with with unselected tracks greyed out.
 *
 * @param track The track to render.
 * @param number The number of the track in the list.
 * @param selected Whether the track is selected (and should be highlighted).
 */
function Track({
  track,
  number,
  selected,
}: {
  track: Result;
  number: number;
  selected: boolean;
}) {
  const theme = useTheme();
  return (
    <ListItem disablePadding>
      <ListItemText
        primaryTypographyProps={{
          style: {
            color: selected
              ? theme.palette.text.primary
              : theme.palette.text.disabled,
          },
        }}
      >
        {number}. {track.name}
      </ListItemText>
    </ListItem>
  );
}

/**
 * Component for the list of tracks in the mash-up.
 *
 * @param tracks The list of tracks to render.
 * @param currentTrack The index of the currently playing track.
 */
export default function TrackList({
  tracks,
  currentTrack,
}: {
  tracks: Array<Result>;
  currentTrack: number | null;
}) {
  return (
    <TrackListContainer>
      <List>
        {tracks.map((track, index) => (
          <Track
            track={track}
            number={index + 1}
            selected={index == currentTrack}
            key={track.id}
          />
        ))}
      </List>
    </TrackListContainer>
  );
}
