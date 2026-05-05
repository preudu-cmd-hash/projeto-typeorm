import { Router } from "express";
import { UserController } from "../controller/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../entity/User";

const router = Router();
const userControler = new UserController();

router.get("/", userControler.list);
router.post("/", userControler.create);
router.get("/active", userControler.listActive);
router.get("/:id", userControler.listById);
router.patch("/:id", authMiddleware, userControler.update);
router.patch(
  "/role/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN]),
  userControler.updateRole
);
router.patch("/:id/toggle", userControler.toggleActive);
router.delete("/:id", authMiddleware, userControler.delete);

export const userRoutes = router;
