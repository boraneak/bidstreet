import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { AuthRequest } from "../interfaces/AuthRequest";
import { DecodedToken } from "../interfaces/DecodedToken";
const jwtSecret = process.env.JWT_SECRET!;

export const verifyUserToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  const token: string = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  try {
    const decodedToken: DecodedToken = jwt.verify(
      token,
      jwtSecret
    ) as DecodedToken;
    req.user = decodedToken;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // token is expired
      return res.status(401).send("Access denied. Token expired.");
    } else {
      // other errors : invalid signature or malformed token
      return res.status(400).send("Invalid token.");
    }
  }
};
