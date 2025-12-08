import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
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
        message: "No vehicles found",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
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
      req.params.vehicleId as string
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Data Found",
        data: result.rows,
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
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;
  const id = req.params.vehicleId;
  const payload = {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    id,
  };
  try {
    const result = await vehicleService.updateVehicle(payload);
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
    const isBookingExist = await vehicleService.isBookingExist(
      req.params.vehicleId as string
    );
    if (isBookingExist) {
      return res.status(400).json({
        succes: false,
        message: "This vehicle is Booked",
      });
    }
    const result = await vehicleService.deleteVehicle(
      req.params.vehicleId as string
    );
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
