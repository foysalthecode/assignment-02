import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", userController.getAlluser);

router.put("/:userId", userController.updateUser);

export const usersRoutes = router;
