import { Request, Response } from "express";
import { userService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

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
  // const { name, email, phone, role } = req?.body;
  const id = req.params.userId as string;
  const payload = {
    name: req.body?.name,
    email: req.body?.email,
    phone: req.body?.phone,
    role: req.body?.role,
    id,
  };
  const user = req.user as JwtPayload;
  const userRole = req.user?.role;
  const matchProfile = await userService.checkOwnProfile(id, user);
  try {
    if (userRole === "admin" || matchProfile) {
      const result = await userService.updateUser(payload);
      delete result.rows[0].password;
      return res.status(200).json({
        succes: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "You're not authorized",
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Data not found",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const isBookingExist = await userService.isBookingExist(
      req.params.userId as string
    );
    if (isBookingExist) {
      return res.status(400).json({
        succes: false,
        message: "User has Active vehicle Booking",
      });
    }
    const result = await userService.deleteUser(req.params.userId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      return res.status(200).json({
        succes: true,
        message: "User deleted successfully",
      });
    }
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
  deleteUser,
};
