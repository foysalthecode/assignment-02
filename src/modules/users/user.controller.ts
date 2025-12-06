import { Request, Response } from "express";
import { userService } from "./user.service";

const getAlluser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAlluser();
    res.status(200).json({
      succes: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Data not found",
    });
  }
};

export const userController = {
  getAlluser,
};
