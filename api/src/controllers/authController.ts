import { Request, Response } from 'express';
import services from 'services/index';
import { handleError } from 'utils/errorHandler';

export const signUp = async (req: Request, res: Response) => {
  try {
    const user = await services.auth.signUpService(req.body);

    return res.status(201).json({
      message: 'Successfully signed up!',
      user,
    });
  } catch (error) {
    return handleError(res, error, 'Error in signUp:');
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await services.auth.signInService(email, password);

    // Add secure flag for cookies in production
    res.cookie('authCookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Successfully signed in!',
      token,
      user,
    });
  } catch (error) {
    return handleError(res, error, 'Error in signIn:');
  }
};
