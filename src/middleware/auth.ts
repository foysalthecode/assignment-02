import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../database/config";
import { pool } from "../database/db";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unathorized access",
      });
    }
    const secret = config.secret;
    const isVerifiedToken = jwt.verify(token, secret as string) as JwtPayload;
    const user = await pool.query(
      `
        SELECT * FROM users WHERE email=$1
        `,
      [isVerifiedToken.email]
    );
    if (user.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }
    console.log(token);
    next();
  };
};

export default auth;
