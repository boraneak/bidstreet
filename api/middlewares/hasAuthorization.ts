import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

import { config } from 'config/index';
import { IDecodedToken } from 'interfaces/DecodedToken';
import { IAuthRequest } from 'interfaces/requests/AuthRequest';

const hasAuthorization = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.status(401).json('Unauthorized request');
  }

  const token: string = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json('Access denied. No token provided.');
  }

  try {
    const decodedToken: IDecodedToken = jwt.verify(
      token,
      config.jwtSecret!,
    ) as IDecodedToken;
    req.user = decodedToken;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).send('Access denied. Token expired.');
    } else if (err instanceof JsonWebTokenError) {
      return res.status(400).send('Invalid token.');
    } else {
      return res.status(500).send('Internal server error.');
    }
  }
};
export default hasAuthorization;
