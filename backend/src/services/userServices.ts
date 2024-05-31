import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import { getErrorMessage } from "../../utils/dbErrorHandler";
import { IUserRequest } from "../../interfaces/UserRequest";
import mongoose from "mongoose";

export const createUser = async (req: Request, res: Response) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err: any) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.json({ error: "ID is undefined" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    // const isSeller = req.user && req.user.seller;
    // if (isSeller) {
    //   console.log('he is a seller');
    // } else {
    //   console.log('not a seller');
    // }
    res.send(user);
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
  }
};

export const readUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.json({ error: "ID is undefined" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    const user = await User.findById(userId, { hashed_password: 0, salt: 0 });
    res.send(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user by id", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user by id", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isSeller = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const isSeller = req.user && req.user.seller;
  if (!isSeller) {
    return res.status(403).json({
      error: "User is not a seller",
    });
  }
  next();
};

export default {
  createUser,
  getUserById,
  readUserProfile,
  getAllUsers,
  deleteUserById,
  updateUserById,
  isSeller,
};
