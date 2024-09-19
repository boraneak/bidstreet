import User from '../models/userModel';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from '../../interfaces/requests/AuthRequest';
import { IDecodedToken } from '../../interfaces/DecodedToken';
const jwtSecret = process.env.JWT_SECRET!;
const tokenDuration = process.env.TOKEN_DURATION;

export const signUp = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
      jwtSecret,
      { expiresIn: tokenDuration },
    );

    res.cookie('authCookie', token, { httpOnly: true });

    return res.status(201).json({
      message: 'Successfully signed up!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    return res.status(400).json({
      error: 'Could not sign up. Please try again.',
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({
        error: 'Password does not match.',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
      jwtSecret,
      { expiresIn: tokenDuration },
    );

    res.cookie('authCookie', token, { httpOnly: true });

    return res.status(200).json({
      message: 'Successfully signed in!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (error) {
    console.error('Error in signIn:', error);
    return res.status(400).json({
      error: 'Could not sign in. Please try again.',
    });
  }
};

export const hasAuthorization = (
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
      jwtSecret,
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
