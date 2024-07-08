# Spotify Booster

## About

Spotify Booster is a web app that allows you to create mashups of similar sounding sections of spotify tracks.

Simply login with Spotify, hit Create New Mashup, search and select a starting track and source playlist or album, and click create.

Spotify Booster will look at the key, tempo, mode, time signature, and loudness of portions of the tracks to generate a mashup where the most similar sections are played sequentially.

The mashup will show up on the right and you can play it back from Spotfiy right in the Spotify Booster app.

### Features

* Login/Logout with Spotify
* Create Mashups
* Save and Search for Mashups
* Playback Mashup
* Search for Spotify songs, albums, playlist, and artists

## Built With

* Node.js
* React.js
* Typescript
* Mocha, Chai
* SQLite

## Running with Docker

### Prerequisites

* Docker
* Spotify API access to Web Playback SDK and Web API

### Building and Running Container

1. Make a copy of `template.env` and name it `.env`
2. Set the values in `.env` to match your Spotify API configuration
3. Build the container
    ```bash
    docker build --tag spotify-booster .
    ```
4. Start the container
    ```bash
    docker run -p 8080:8080 --env-file .env -v ./data:/app/data  spotify-booster
    ```
    Change `8080:8080` to `8080:<Your Desired Port>` to have app listen on a different port
5. App is now accessible at `http://localhost:8080`

* Note: Music playback requires a Spotify Premium account

## Developing Locally

### Prerequisites

* Node.js (Tested with Node 18)

### Frontend Build

1. In the `/frontend` directory, run:
```
npm install
```

2. Open `config/spotify_config.js` and fill in the `clientId` and `clientSec` properties, they should be your spotify client id and spotify client secret respectively.
  
3. Open `config/backend_config.js` and set `baseURL` to the base url of where your backend server is hosted

4. Then build the project
```
npm run build
```

### Backend Installation

1. In the `/backend` directory, run:
```
npm install
```

2. Then build the project

```
npm run build
```

3. Make a copy of the `template.env` file and name it `.env`. Then fill in the settings.

    * `APP_ENV` should be set to either `Development` or `Production`
    * `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REDIRECT_URL` should be set to your spotify api key values
    * `WEB_PORT` should be set the desired port for the backend web server to be listening on
    * `WEB_SATIC_PATH` should be set to the path to the frontend build directory, `WEB_INDEX_PATH` to where `index.html` is
    * `DATABASE_PATH` points to where the database is/or should be created at
    * `LOG_FILE_DIRECTORY` points to the directory where logs should be stored

4. Finally, to start the backend web server, run:
```
npm start
```

## Contributers

**Alexander Eilert: Frontend** (Frontend Design, Song Playback)

**Bennett Wu: Backend** (SQLite Interface, Mashup Generation, API Endpoints)

**Porter Shawer: Frontend** (Song/Artist/Album/Playlist/Mashup Search, Song and Mashup Playback)

**Tommy Liu: Frontend** (Spotify Login/Authentication, Playback Progress Display)

