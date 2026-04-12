import express from "express";
import { rejectDocuments, verifyDocuments } from "../controllers/documentController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, allowRoles("inspector", "admin"));

router.put("/:carId/verify", verifyDocuments);
router.put("/:carId/reject", rejectDocuments);

export default router;
