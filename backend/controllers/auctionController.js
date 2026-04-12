import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Car from "../models/Car.js";
import { finalizeAuctionIfNeeded } from "../utils/auctionUtils.js";
import { getAvailabilityStatus, getAuctionStatus, isListingApproved } from "../utils/carState.js";
import { createLog } from "../utils/logUtils.js";

export const placeBid = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const car = await Car.findById(req.params.carId);

    if (!car || !car.isAuction) {
      const error = new Error("Auction car not found");
      error.statusCode = 404;
      throw error;
    }

    const { car: syncedCar } = await finalizeAuctionIfNeeded(car);

    if (!isListingApproved(syncedCar)) {
      const error = new Error("Car must have verified documents and inspection before bidding");
      error.statusCode = 400;
      throw error;
    }

    if (getAuctionStatus(syncedCar) !== "active") {
      const error = new Error("Auction has already ended");
      error.statusCode = 400;
      throw error;
    }

    if (getAvailabilityStatus(syncedCar) !== "available") {
      const error = new Error("Bidding is only allowed on available cars");
      error.statusCode = 400;
      throw error;
    }

    const highestBid = await Bid.findOne({ car: syncedCar._id }).sort({ amount: -1 });
    const minimumAmount = highestBid ? highestBid.amount + 1000 : syncedCar.price;

    if (!amount || Number(amount) < minimumAmount) {
      const error = new Error(`Bid must be at least ${minimumAmount}`);
      error.statusCode = 400;
      throw error;
    }

    const bid = await Bid.create({
      amount,
      user: req.user._id,
      car: syncedCar._id,
    });

    await createLog({
      action: "bid placed",
      userId: req.user._id,
      carId: syncedCar._id,
    });

    res.status(201).json({
      success: true,
      bid,
    });
  } catch (error) {
    next(error);
  }
};

export const getHighestBid = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.carId)) {
      return res.json({
        success: true,
        highestBid: null,
        auctionStatus: "ended",
        auctionEndTime: null,
        winner: null,
        order: null,
      });
    }

    const car = await Car.findById(req.params.carId);

    if (!car) {
      return res.json({
        success: true,
        highestBid: null,
        auctionStatus: "ended",
        auctionEndTime: null,
        winner: null,
        order: null,
      });
    }

    const {
      car: syncedCar,
      highestBid: finalizedBid,
      order,
      winner,
    } = await finalizeAuctionIfNeeded(car);

    const highestBid =
      finalizedBid ||
      (await Bid.findOne({ car: req.params.carId })
      .sort({ amount: -1 })
      .populate("user", "name"));

    res.json({
      success: true,
      highestBid,
      auctionStatus: getAuctionStatus(syncedCar),
      auctionEndTime: syncedCar.auctionEndTime || syncedCar.auctionEndsAt || null,
      winner,
      order,
    });
  } catch (error) {
    next(error);
  }
};
