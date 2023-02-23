import React from 'react';
import './App.scss';
import Header from './components/header/Header';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import GlobalStyles from '@mui/material/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.background.default },
        }}
      ></GlobalStyles>
      <Header />
    </ThemeProvider>
  );
}

export default App;
