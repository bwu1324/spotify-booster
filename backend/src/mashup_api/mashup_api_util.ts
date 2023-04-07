import { AuthRequest } from '../spotify_authentication/spotify_authentication';
import { Response } from 'express';

export function runMashupAPIFunction(func: (req: AuthRequest, res: Response) => Promise<{ code: number; res: unknown }>) {
  return async (req: AuthRequest, res: Response) => {
    try {
      const result = await func(req, res);
      res.status(result.code).send(result.res);
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  };
}

export function runAuthMashupAPIFunction(
  func: (req: AuthRequest, res: Response) => Promise<{ code: number; res: unknown }>,
  auth_function: (req: AuthRequest) => Promise<boolean>
) {
  return async (req: AuthRequest, res: Response) => {
    try {
      if (!(await auth_function(req))) {
        res.status(403).send({ error_message: 'Unauthorized' });
        return;
      }

      const result = await func(req, res);
      res.status(result.code).send(result.res);
    } catch (error) {
      res.status(400).send({ error_message: error.message });
    }
  };
}
