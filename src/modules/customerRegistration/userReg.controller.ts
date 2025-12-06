import { Request, Response } from "express";
import { userRegService } from "./userReg.service";

const createCustomer = async (req: Request, res: Response) => {
  try {
    const result = await userRegService.createUser(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await userRegService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const userRegController = {
  createCustomer,
  loginUser,
};
