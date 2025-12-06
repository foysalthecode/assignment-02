import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", vehiclesController.createVehicle);

router.get("/", vehiclesController.getAllVehicles);

router.get("/:vehicleId", vehiclesController.getSingleVehicle);

router.put("/:vehicleId", vehiclesController.updateVehicle);

router.delete("/:vehicleId", vehiclesController.deleteVehicle);

export const vehiclesRoutes = router;
