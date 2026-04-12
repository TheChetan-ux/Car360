import express from "express";
import { getPendingCars, rejectCar, verifyCar } from "../controllers/inspectorController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, allowRoles("inspector"));

router.get("/cars/pending", getPendingCars);
router.put("/car/:id/verify", verifyCar);
router.put("/car/:id/reject", rejectCar);

export default router;
