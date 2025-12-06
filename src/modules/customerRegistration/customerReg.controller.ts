import { Request, Response } from "express";
import { customerRegService } from "./customerReg.service";

const createCustomer = async (req: Request, res: Response) => {
  try {
    const result = await customerRegService.createCustomer(req.body);
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

export const customerRegController = {
  createCustomer,
};
