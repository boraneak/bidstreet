import { Request, Response } from 'express';
import services from 'services/index';
import { handleError } from 'utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await services.auth.registerService(req.body);

    return res.status(201).json({
      message: 'Successfully registered!',
      user,
    });
  } catch (error) {
    return handleError(res, error, 'Error registering:');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await services.auth.loginService(email, password);

    // Add secure flag for cookies in production
    res.cookie('authCookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Successfully logged in!',
      token,
      user,
    });
  } catch (error) {
    return handleError(res, error, 'Error logging in:');
  }
};
