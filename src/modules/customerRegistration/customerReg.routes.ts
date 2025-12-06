import { Router } from "express";
import { customerRegController } from "./customerReg.controller";

const router = Router();

router.post("/signup", customerRegController.createCustomer);

export const customerRegRoutes = router;
