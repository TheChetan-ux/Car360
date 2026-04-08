import express from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  purchaseCar,
} from "../controllers/carController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCars);
router.get("/:id", getCarById);
router.post("/", protect, allowRoles("seller", "dealer", "admin"), createCar);
router.post("/:id/purchase", protect, allowRoles("buyer", "seller", "dealer", "admin"), purchaseCar);
router.delete("/:id", protect, deleteCar);

export default router;
