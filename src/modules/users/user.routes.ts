import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/", userController.getAlluser);

router.put("/:userId", userController.updateUser);

router.delete("/:userId", userController.deleteUser);

export const usersRoutes = router;
