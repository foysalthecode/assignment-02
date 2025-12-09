import express, { Request, Response } from "express";
import initDB from "./database/db";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { usersRoutes } from "./modules/users/user.routes";
import { userRegRoutes } from "./modules/userRegistration/userReg.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
const app = express();

app.use(express.json());

//* DB
initDB();

app.use("/api/v1/vehicles", vehiclesRoutes); //* vehicles routes

app.use("/api/v1/auth", userRegRoutes); //* user Registration routes

app.use("/api/v1/users", usersRoutes); //* users routes

app.use("/api/v1/bookings", bookingRoutes); //* bookings routes

app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental System Backed");
});

app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;
