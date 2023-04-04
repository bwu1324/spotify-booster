// This file contains the entire code for the TrackList component.
// The TrackList component is a container for the list of tracks in the mash-up.

import React from 'react';

import { TrackListContainer } from '../../theme';
import { Result } from '../util';
import { List, ListItem, ListItemText } from '@mui/material';

// Used for rendering each track.
function RenderedTrack({ track, number }: { track: Result; number: number }) {
  return (
    <ListItem disablePadding>
      <ListItemText>
        {number}. {track.name}
      </ListItemText>
    </ListItem>
  );
}

export default function TrackList({
  tracks,
  currentTrack,
}: {
  tracks: Array<Result>;
  currentTrack: Result | null;
}) {
  return (
    <TrackListContainer>
      <List>
        {tracks.map((track, index) => (
          <RenderedTrack track={track} number={index + 1} key={track.id} />
        ))}
      </List>
    </TrackListContainer>
  );
}
