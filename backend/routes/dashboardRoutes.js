import express from "express";
import {
  getAdminDashboard,
  getBuyerDashboard,
  getSellerDashboard,
} from "../controllers/dashboardController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/buyer", protect, allowRoles("buyer", "admin"), getBuyerDashboard);
router.get("/seller", protect, allowRoles("seller", "dealer", "admin"), getSellerDashboard);
router.get("/admin", protect, allowRoles("admin"), getAdminDashboard);

export default router;
