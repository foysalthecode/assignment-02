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
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "no data found",
      });
    }
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

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getSingleVehicle(
      req.params.id as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Data Found",
      });
    }
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

const updateVehicle = async (req: Request, res: Response) => {
  const { daily_rent_price, availability_status } = req.body;
  const id = req.params.id;
  try {
    const result = await vehicleService.updateVehicle(
      daily_rent_price,
      availability_status,
      id as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        messsage: "vehicle didnot found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicle update successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Vehicle Deleted Successfully",
      });
    }
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
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
