import express from "express";
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  purchaseCar,
} from "../controllers/carController.js";
import { uploadCarDocuments } from "../controllers/documentController.js";
import { allowRoles, optionalProtect, protect } from "../middleware/authMiddleware.js";
import { documentUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getCars);
router.get("/:id", optionalProtect, getCarById);
router.post("/", protect, allowRoles("seller", "dealer", "admin"), createCar);
router.post(
  "/:id/documents",
  protect,
  allowRoles("seller", "dealer"),
  documentUpload,
  uploadCarDocuments
);
router.post("/:id/purchase", protect, allowRoles("buyer", "seller", "dealer", "admin"), purchaseCar);
router.delete("/:id", protect, deleteCar);

export default router;
