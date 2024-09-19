import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { IUserRequest } from '../../interfaces/requests/UserRequest';
import { isValidObjectId } from '../../utils/isValidObjectId';

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'ID is undefined' });
    }
    if (!isValidObjectId(userId, res, 'user')) return;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }
    res.json(user);
    return next();
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const readUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!isValidObjectId(userId, res, 'user')) return;
    const user = await User.findById(userId, { hashed_password: 0, salt: 0 });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.error('Error retrieving all users:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
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

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user by id', error);
    return res.status(500).json({ error: 'Internal server error' });
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
    console.error('Error deleting user by id', error);
    return res.status(500).json({ error: 'Internal server error' });
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
