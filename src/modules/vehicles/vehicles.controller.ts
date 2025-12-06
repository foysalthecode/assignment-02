import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: "Successfully posted",
      data: result.rows[0],
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    return res.status(200).json({
      success: true,
      message: "data retrived successfully",
      data: result.rows,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
};
