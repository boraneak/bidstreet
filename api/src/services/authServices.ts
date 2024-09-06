import User from "../models/userModel";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IAuthRequest } from "../../interfaces/AuthRequest";
import { IDecodedToken } from "../../interfaces/DecodedToken";
const jwtSecret = process.env.JWT_SECRET!;
const tokenDuration = process.env.TOKEN_DURATION;

export const signin = async (req: Request, res: Response) => {
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

export const signout = (req: Request, res: Response) => {
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

export const hasAuthorization = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json("Unauthorized request");
  }

  const token: string = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json("Access denied. No token provided.");
  }

  try {
    const decodedToken: IDecodedToken = jwt.verify(
      token,
      jwtSecret
    ) as IDecodedToken;
    req.user = decodedToken;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).send("Access denied. Token expired.");
    } else if (err instanceof JsonWebTokenError) {
      return res.status(400).send("Invalid token.");
    } else {
      return res.status(500).send("Internal server error.");
    }
  }
};
