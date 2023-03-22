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
  const closeSearchButton = screen.getByLabelText('close');
  expect(closeSearchButton).toBeInTheDocument();
  fireEvent.click(closeSearchButton);
  expect(searchBox).not.toBeInTheDocument();

  const searchButton = screen.getByLabelText('search');
  expect(searchButton).toBeInTheDocument();
  const mashupTitle = screen.getByLabelText('mashup title');
  expect(mashupTitle).toBeInTheDocument();
  fireEvent.click(searchButton);
  expect(mashupTitle).not.toBeInTheDocument();
});
