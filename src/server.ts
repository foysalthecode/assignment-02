import express, { Request, Response } from "express";
import initDB from "./database/db";
import config from "./database/config";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { customerRoutes } from "./modules/customers/customers.routes";
import { customerRegRoutes } from "./modules/customerRegistration/customerReg.routes";
const app = express();

app.use(express.json());

//* DB
initDB();

app.use("/api/v1/vehicles", vehiclesRoutes); //* vehicles

app.use("/api/v1/auth",customerRegRoutes) //* Customer Registration

// app.use("/api/v1/users", customerRoutes); //* Customers

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

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
