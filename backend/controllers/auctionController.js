import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Car from "../models/Car.js";

export const placeBid = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const car = await Car.findById(req.params.carId);

    if (!car || !car.isAuction) {
      const error = new Error("Auction car not found");
      error.statusCode = 404;
      throw error;
    }

    const highestBid = await Bid.findOne({ car: car._id }).sort({ amount: -1 });
    const minimumAmount = highestBid ? highestBid.amount + 1000 : car.price;

    if (!amount || Number(amount) < minimumAmount) {
      const error = new Error(`Bid must be at least ${minimumAmount}`);
      error.statusCode = 400;
      throw error;
    }

    const bid = await Bid.create({
      amount,
      user: req.user._id,
      car: car._id,
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
      });
    }

    const highestBid = await Bid.findOne({ car: req.params.carId })
      .sort({ amount: -1 })
      .populate("user", "name");

    res.json({
      success: true,
      highestBid,
    });
  } catch (error) {
    next(error);
  }
};

