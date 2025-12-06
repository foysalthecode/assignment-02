import express, { Request, Response } from "express";
import initDB from "./database/db";
import config from "./database/config";
import { vehiclesRoutes } from "./modules/vehicles/vehicles.routes";
import { usersRoutes } from "./modules/users/user.routes";
import { userRegRoutes } from "./modules/userRegistration/userReg.routes";
const app = express();

app.use(express.json());

//* DB
initDB();

app.use("/api/v1/vehicles", vehiclesRoutes); //* vehicles

app.use("/api/v1/auth", userRegRoutes); //* user Registration

app.use("/api/v1/users", usersRoutes); //* users

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
