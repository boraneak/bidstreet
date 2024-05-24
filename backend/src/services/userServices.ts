import User from "../models/userModel";
import { Request, Response } from "express";
import { getErrorMessage } from "../../utils/dbErrorHandler";

export const create = async (req: Request, res: Response) => {
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
