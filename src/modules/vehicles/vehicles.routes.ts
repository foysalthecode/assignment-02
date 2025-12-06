import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", vehiclesController.createVehicle);

router.get("/", vehiclesController.getAllVehicles);

export const vehiclesRoutes = router;
