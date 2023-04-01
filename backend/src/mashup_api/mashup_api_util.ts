import { AuthRequest } from '../spotify_authentication/spotify_authentication';
import { Response } from 'express';

export default function runMashupAPIFunction(func: (req: AuthRequest, res: Response) => Promise<object>) {
  return async (req: AuthRequest, res: Response) => {
    try {
      res.status(200).send(await func(req, res));
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  };
}
