import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../database/config";
import { pool } from "../database/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unathorized access",
      });
    }
    const secret = config.secret;
    const decoded = jwt.verify(token, secret as string) as JwtPayload;
    const user = await pool.query(
      `
        SELECT * FROM users WHERE email=$1
        `,
      [decoded.email]
    );
    if (user.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(401).json({
        success: false,
        message: "unathorized access",
      });
    }
    next();
  };
};

export default auth;
