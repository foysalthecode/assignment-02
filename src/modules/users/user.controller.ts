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

const updateUser = async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;
  const id = req.params.userId;
  const payload = { name, email, phone, role, id };
  try {
    const result = await userService.updateUser(payload);
    delete result.rows[0].password;
    res.status(200).json({
      succes: true,
      message: "User updated successfully",
      data: result.rows[0],
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
  updateUser,
};
