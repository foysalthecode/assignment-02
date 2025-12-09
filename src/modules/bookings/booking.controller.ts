import { Request, Response } from "express";
import { bookingService } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { usersResult, vehicleResult } =
      await bookingService.isVehicleAndUserExistForBook(req.body);
    if (usersResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    } else if (vehicleResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Vehicle Not Found",
      });
    } else {
      const { result, vehicle } = await bookingService.createBooking(req.body);
      const resultt = result.rows[0];
      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: resultt,
        vehicle,
      });
    }
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBooking = async (req: Request, res: Response) => {
  try {
    const email = req.user?.email as string;
    const ownBooking = await bookingService.singleCustomerBooking(email);
    const { result, customerInfo, vehicleInfo } =
      await bookingService.getAllBooking();
    const { role } = req.user as JwtPayload;
    const mainResult = result.rows;
    const customer = customerInfo.rows;
    const vehicle = vehicleInfo.rows;
    if (role === "admin") {
      return res.status(201).json({
        success: true,
        message: "Booking retrieved successfully",
        data: { mainResult, customer, vehicle },
        // data: result.rows,
      });
    } else if (role === "customer") {
      return res.status(200).json({
        success: true,
        message: "Booking retrieved successfully",
        data: ownBooking,
        vehicle,
      });
    }
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { role } = req.user as JwtPayload;
  const id = req.params.bookingId as string;
  try {
    const { result, vehicleInfo } = await bookingService.updateBooking(
      req.body.status,
      id
    );
    const vehicle = vehicleInfo.rows[0];
    if (role === "admin" && req.body.status === "returned") {
      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result.rows[0],
        vehicle,
      });
    } else if (role === "customer" && req.body.status === "cancelled") {
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Your are not authorized for this`,
      });
    }
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
  updateBooking,
};
