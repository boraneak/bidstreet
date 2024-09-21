import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { config } from '../../config/config';

export const signUp = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    // Generate hashed password using bcrypt
    const salt = await bcrypt.genSalt(config.saltRounds);
    const hashed_password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      ...req.body,
      salt,
      hashed_password,
    });

    await user.save();

    return res.status(201).json({
      message: 'Successfully signed up!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    return res.status(400).json({
      error: 'Could not sign up. Please try again.',
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    // Check if the provided password matches using bcrypt
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.hashed_password,
    );
    if (!isMatch) {
      return res.status(401).json({
        error: 'Password does not match.',
      });
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

    // Add secure flag for cookies in production
    res.cookie('authCookie', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      message: 'Successfully signed in!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (error) {
    console.error('Error in signIn:', error);
    return res.status(400).json({
      error: 'Could not sign in. Please try again.',
    });
  }
};
