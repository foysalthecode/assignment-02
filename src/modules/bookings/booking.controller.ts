import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { result, vehicle } = await bookingService.createBooking(req.body);
    const resultt = result.rows[0];
    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: resultt,
      vehicle,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getAllBooking();
    return res.status(201).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBooking,
};
