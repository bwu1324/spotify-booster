import sinon from 'sinon';
import { Response, NextFunction } from 'express';

import * as spotifyAuth from '../../../src/spotify_authentication/spotify_authentication';

/**
 * stubSpotifyAuth() - stubs Spotify authentication function for custom behavior, calls sets req.spotify_uid if spotify_access_token === 'valid_token'
 * @param uid - uid to append to req object if successful
 * @param always_set - if true, sets req.spotify_uid no matter what
 */
export function stubSpotifyAuth(uid: string, always_set?: boolean) {
  sinon.stub(spotifyAuth, 'default').callsFake(() => {
    return async function (req: spotifyAuth.AuthRequest, res: Response, next: NextFunction) {
      req.spotify_uid = '';
      if (always_set === true) req.spotify_uid = uid;
      if (req.cookies['spotify_access_token'] === 'valid_token') req.spotify_uid = uid;

      next();
    };
  });
}
