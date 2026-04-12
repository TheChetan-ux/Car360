import Bid from "../models/Bid.js";
import Car from "../models/Car.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { finalizeAuctionsForCars } from "../utils/auctionUtils.js";
import { normalizeCar } from "../utils/carState.js";

export const getBuyerDashboard = async (req, res, next) => {
  try {
    const [orders, bids] = await Promise.all([
      Order.find({ buyer: req.user._id })
        .sort({ createdAt: -1 })
        .populate("car", "title price images status availabilityStatus auctionStatus"),
      Bid.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("car", "title images isAuction auctionStatus"),
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
    const syncedCars = await finalizeAuctionsForCars(cars);

    res.json({
      success: true,
      dashboard: {
        cars: syncedCars.map(normalizeCar),
        totalListings: syncedCars.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (_req, res, next) => {
  try {
    const [users, cars, bids, orders, totals, recentOrders] = await Promise.all([
      User.countDocuments(),
      Car.countDocuments(),
      Bid.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$finalPrice" },
            totalCommission: { $sum: "$commissionAmount" },
          },
        },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("buyer", "name email")
        .populate("car", "title images"),
    ]);

    const totalsRow = totals[0] || { totalRevenue: 0, totalCommission: 0 };

    res.json({
      success: true,
      dashboard: {
        users,
        cars,
        bids,
        orders,
        totalUsers: users,
        totalCars: cars,
        totalOrders: orders,
        totalRevenue: totalsRow.totalRevenue || 0,
        totalCommission: totalsRow.totalCommission || 0,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
