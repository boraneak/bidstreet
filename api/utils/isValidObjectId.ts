import { Response } from "express";
import mongoose from "mongoose";

export const isValidObjectId = (
  id: string,
  res: Response,
  modelName: string,
): boolean => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: `Invalid ${modelName} id format` });
    return false;
  }
  return true;
};
