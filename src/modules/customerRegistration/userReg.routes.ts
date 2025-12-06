import { Router } from "express";
import { userRegController } from "./userReg.controller";

const router = Router();

router.post("/signup", userRegController.createCustomer);

router.post("/login", userRegController.loginUser);

export const userRegRoutes = router;
