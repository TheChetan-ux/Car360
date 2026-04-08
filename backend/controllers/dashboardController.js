import Bid from "../models/Bid.js";
import Car from "../models/Car.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getBuyerDashboard = async (req, res, next) => {
  try {
    const [orders, bids] = await Promise.all([
      Order.find({ buyer: req.user._id }).populate("car", "title price images status"),
      Bid.find({ user: req.user._id }).populate("car", "title images isAuction"),
    ]);

    res.json({
      success: true,
      dashboard: {
        orders,
        bids,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerDashboard = async (req, res, next) => {
  try {
    const cars = await Car.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      dashboard: {
        cars,
        totalListings: cars.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (_req, res, next) => {
  try {
    const [users, cars, bids, orders] = await Promise.all([
      User.countDocuments(),
      Car.countDocuments(),
      Bid.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({
      success: true,
      dashboard: {
        users,
        cars,
        bids,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

