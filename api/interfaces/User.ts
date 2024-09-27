import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
  name: string;
  email: string;
  hashed_password: string;
  salt: string;
  updated?: Date;
  created: Date;
  seller: boolean;
  password?: string;
  authenticate: (plainText: string) => boolean;
  encryptPassword: (password: string) => string;
  genSalt: () => string;
  _id: mongoose.Types.ObjectId;
}
