import User from 'models/userModel';
import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from 'interfaces/requests/UserRequest';
import { isValidObjectId } from 'utils/isValidObjectId';
import { handleError } from 'utils/errorHandler';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;
    const user = await User.findById(userId);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error, 'Error retrieving user');
  }
};

export const readUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;
    const user = await User.findById(userId, { hashed_password: 0, salt: 0 });
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error, 'Error retrieving user profile');
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return handleError(res, error, 'Error retrieving all users');
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return handleError(res, error, 'Error updating user by id');
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
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
    return res.status(403).json({
      error: 'User is not a seller',
    });
  }
  return next();
};
