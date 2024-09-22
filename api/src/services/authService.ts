import User from 'models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'config/config';
import { IUser } from 'interfaces/User';

export const signUpService = async (userData: Partial<IUser>) => {
  if (typeof userData.email !== 'string') {
    throw new Error('Invalid email format');
  }
  const existingUser = await User.findOne({ email: { $eq: userData.email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const salt = await bcrypt.genSalt(config.saltRounds);
  const hashed_password = await bcrypt.hash(userData._password!, salt);

  const user = new User({
    ...userData,
    salt,
    hashed_password,
  });

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    seller: user.seller,
  };
};

export const signInService = async (email: string, password: string) => {
  const user = await User.findOne({ email: { $eq: email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.hashed_password);
  if (!isMatch) {
    throw new Error('Password does not match');
  }

  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      seller: user.seller,
    },
    config.jwtSecret!,
    { expiresIn: config.tokenDuration },
  );

  return { token, user };
};
