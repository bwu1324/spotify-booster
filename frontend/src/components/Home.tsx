// This file contains the entire code for the Home component.

import React, { useContext } from 'react';

// Styling import
import { ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { theme } from '../theme';
import GlobalStyles from '@mui/material/GlobalStyles';
import '../App.scss';

// Components import
import Header from './Header';
import Splash from './splash/Splash';
import Player from './player/Player';
import InputPanel from './inputPanel/InputPanel';
import { AccessTokenContext, EmptyResult, MashupContext, Result } from './util';

const styles = {
  parentGrid: {
    height: '92vh', // set parent height to viewport height
  },
  childGrid: {
    height: '100%', // each child takes 50% of parent height
  },
};

function Home() {
  // Current mashup ID. '...' if a mashup is in the creation process.
  const [mashup, setMashup] = React.useState<Result>(EmptyResult);
  const spotifyAccessToken = useContext(AccessTokenContext).token;

  return (
    <ThemeProvider theme={theme}>
      <MashupContext.Provider value={{ mashup: mashup, setMashup: setMashup }}>
        <GlobalStyles
          styles={{
            body: { backgroundColor: theme.palette.background.default },
          }}
        ></GlobalStyles>
        <Header />
        {spotifyAccessToken != null ? (
          <>
            <Grid container style={styles.parentGrid}>
              <Grid item xs={4} sx={{ padding: 2 }} style={styles.childGrid}>
                <InputPanel />
              </Grid>
              <Grid
                item
                xs={8}
                sx={{
                  paddingLeft: 0,
                  paddingRight: 2,
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
                style={styles.childGrid}
              >
                <Player mashup={mashup} />
              </Grid>
            </Grid>
          </>
        ) : (
          <Splash />
        )}
      </MashupContext.Provider>
    </ThemeProvider>
  );
}

export default Home;
