import express from "express";
import { getHighestBid, placeBid } from "../controllers/auctionController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:carId/bid", protect, allowRoles("buyer", "seller", "dealer", "admin"), placeBid);
router.get("/:carId/highest", getHighestBid);

export default router;
