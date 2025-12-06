import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", vehiclesController.createVehicle);

router.get("/", vehiclesController.getAllVehicles);

router.get("/:id", vehiclesController.getSingleVehicle);

router.put("/:id", vehiclesController.updateVehicle);

router.delete("/:id", vehiclesController.deleteVehicle);

export const vehiclesRoutes = router;
