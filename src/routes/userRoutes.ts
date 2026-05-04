import { Router } from "express";
import { UserController } from "../controller/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const userControler = new UserController();

router.get("/", userControler.list);
router.post("/", userControler.create);
router.get("/active", userControler.listActive);
router.patch("/:id", authMiddleware, userControler.update);
router.get("/:id", userControler.listById);
router.patch("/:id/toggle", userControler.toggleActive);
router.delete("/:id", userControler.delete);

export const userRoutes = router;
