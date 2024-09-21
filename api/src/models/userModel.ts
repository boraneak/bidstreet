import mongoose, { Schema } from 'mongoose';
import { IUser } from 'interfaces/User';

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
      required: [true, 'Email is required'],
    },
    hashed_password: {
      type: String,
      required: [true, 'Password is required'],
    },
    salt: String,
    seller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', userSchema);
