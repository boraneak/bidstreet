import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from 'interfaces/requests/UserRequest';
import { handleError } from 'utils/errorHandler';
import services from 'services/index';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await services.user.getUserByIdService(req.params.userId);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error, 'Error retrieving user');
  }
};

export const readUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await services.user.readUserProfileService(req.params.userId);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error, 'Error retrieving user profile');
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await services.user.getAllUsersService();
    return res.status(200).json(users);
  } catch (error) {
    return handleError(res, error, 'Error retrieving all users');
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const updatedUser = await services.user.updateUserByIdService(
      req.params.userId,
      req.body,
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    return handleError(res, error, 'Error updating user by id');
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await services.user.deleteUserByIdService(req.params.userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return handleError(res, error, 'Error deleting user by id');
  }
};

export const isSeller = (
  req: IUserRequest,
  res: Response,
  next: NextFunction,
) => {
  const isSeller = req.user && req.user.seller;
  if (!isSeller) {
    return res.status(403).json({ error: 'User is not a seller' });
  }
  return next();
};
