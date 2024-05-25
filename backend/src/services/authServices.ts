import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import "dotenv/config";
const jwtSecret = process.env.JWT_SECRET!;
const tokenDuration = process.env.TOKEN_DURATION;

export const signIn = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user)
      return res.status(401).json({
        error: "User not found",
      });

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: "Email and password don't match.",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
      jwtSecret,
      {
        expiresIn: tokenDuration,
      }
    );
    res.cookie("authCookie", token, {
      httpOnly: true,
    });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (err) {
    return res.status(401).json({
      error: "Could not sign in",
    });
  }
};
export const signOut = (req: Request, res: Response) => {
  try {
    if (req.cookies && req.cookies.authCookie) {
      res.clearCookie("authCookie");
      return res.status(200).json({
        message: "signed out",
      });
    }
    return res.status(200).json({
      message: "no user was signed in",
    });
  } catch (err) {
    return res.status(500).json({
      error: "Could not sign out",
    });
  }
};
