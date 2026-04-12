import Bid from "../models/Bid.js";
import Car from "../models/Car.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { createLog } from "./logUtils.js";
import { createMarketplaceOrder } from "./orderUtils.js";

export const getAuctionEndTime = (car = {}) => {
  return car.auctionEndTime || car.auctionEndsAt || null;
};

export const getAuctionStatus = (car = {}) => {
  if (!car.isAuction) {
    return "ended";
  }

  const endTime = getAuctionEndTime(car);
  const normalizedStatus = car.auctionStatus || "active";

  if (endTime && new Date(endTime).getTime() <= Date.now()) {
    return "ended";
  }

  return normalizedStatus;
};

export const finalizeAuctionIfNeeded = async (inputCar) => {
  const car =
    inputCar && typeof inputCar.save === "function"
      ? inputCar
      : await Car.findById(inputCar);

  if (!car || !car.isAuction) {
    return {
      car,
      highestBid: null,
      order: null,
      winner: null,
    };
  }

  const endTime = getAuctionEndTime(car);
  let shouldSave = false;

  if (!car.auctionEndTime && endTime) {
    car.auctionEndTime = endTime;
    shouldSave = true;
  }

  const isEnded = endTime ? new Date(endTime).getTime() <= Date.now() : false;

  if (!isEnded) {
    if (car.auctionStatus !== "active") {
      car.auctionStatus = "active";
      shouldSave = true;
    }

    if (shouldSave) {
      await car.save();
    }

    return {
      car,
      highestBid: null,
      order: null,
      winner: null,
    };
  }

  if (car.auctionStatus !== "ended") {
    car.auctionStatus = "ended";
    shouldSave = true;
  }

  const highestBid = await Bid.findOne({ car: car._id })
    .sort({ amount: -1 })
    .populate("user", "name email");

  let order = await Order
    .findOne({ car: car._id })
    .populate("buyer", "name email");

  if (!order && highestBid && car.availabilityStatus === "available") {
    const result = await createMarketplaceOrder({
      buyerId: highestBid.user?._id || highestBid.user,
      carId: car._id,
      finalPrice: highestBid.amount,
      paymentStatus: "completed",
      orderType: "auction",
      throwIfExists: false,
    });

    order = await Order
      .findById(result.order._id)
      .populate("buyer", "name email");

    if (result.created) {
      await createLog({
        action: "car purchased",
        userId: highestBid.user?._id || highestBid.user,
        carId: car._id,
      });
    }

    car.availabilityStatus = "sold";
    shouldSave = true;
  }

  if (order && car.availabilityStatus !== "sold") {
    car.availabilityStatus = "sold";
    shouldSave = true;
  }

  if (shouldSave) {
    await car.save();
  }

  const winnerId = order?.buyer?._id || highestBid?.user?._id || highestBid?.user || null;
  const winner =
    order?.buyer ||
    (winnerId ? await User.findById(winnerId).select("name email") : null);

  return {
    car,
    highestBid,
    order,
    winner,
  };
};

export const finalizeAuctionsForCars = async (cars = []) => {
  return Promise.all(cars.map((car) => finalizeAuctionIfNeeded(car).then((result) => result.car)));
};
