import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders login button', () => {
  render(<App />);
  const buttonElement = screen.getByText('Login with Spotify');
  expect(buttonElement).toBeInTheDocument();
});

test('renders search bar, and search bar buttons work', () => {
  render(<App />);
  const searchBox = screen.getByLabelText('Search');
  expect(searchBox).toBeInTheDocument();
  const clearSearchButton = screen.getByLabelText('clear');
  expect(clearSearchButton).toBeInTheDocument();
});

test('renders filter buttons', () => {
  render(<App />);
  const track = screen.getByLabelText('Track');
  const artist = screen.getByLabelText('Artist');
  const album = screen.getByLabelText('Album');
  const playist = screen.getByLabelText('Playlist');
  const mashup = screen.getByLabelText('Mashup');
  expect(track).toBeInTheDocument();
  expect(artist).toBeInTheDocument();
  expect(album).toBeInTheDocument();
  expect(playist).toBeInTheDocument();
  expect(mashup).toBeInTheDocument();
});
