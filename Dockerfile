FROM node:20

# Build frontend
WORKDIR /app/frontend

COPY frontend/package*.json .

RUN npm install

COPY frontend ./

RUN npm run build

# Build backend
WORKDIR /app/backend

COPY backend/package*.json .

RUN npm install

COPY backend ./

RUN npm run build

RUN mkdir -p /app/data

# Configure environment
WORKDIR /app/backend/build/src

ENV NODE_ENV="Production"

ENV SPOTIFY_SCOPES="user-read-email user-library-read user-read-playback-position user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-private streaming"

ENV WEB_PORT=8080
ENV WEB_STATIC_PATH="/app/frontend/dist/"
ENV WEB_INDEX_PATH="/app/frontend/dist/index.html"

ENV DATABASE_PATH="/app/data/database.db"

ENV LOG_FILE="true"
ENV LOG_CONSOLE="true"
ENV LOG_FILE_DIRECTORY="./logs"
ENV LOG_FILE_NAME="%DATE%.log"
ENV LOG_DATE_PATTERN="YYYY-MM-DD"
ENV LOG_MAX_SIZE="20m"
ENV LOG_MAX_FILES=5
ENV ZIP_LOGS="true"

CMD ["node", "index.js"]
