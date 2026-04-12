import Car from "../models/Car.js";
import fallbackCars from "../data/fallbackCars.js";
import { finalizeAuctionIfNeeded, finalizeAuctionsForCars } from "../utils/auctionUtils.js";
import {
  filterMarketplaceCars,
  getAvailabilityStatus,
  isListingApproved,
  normalizeCar,
  canViewCarDetails,
} from "../utils/carState.js";
import { createLog } from "../utils/logUtils.js";
import { createMarketplaceOrder } from "../utils/orderUtils.js";

const mapFilters = (query) => {
  const filters = {};

  if (query.search) {
    filters.title = { $regex: query.search, $options: "i" };
  }

  if (query.brand) {
    filters.brand = query.brand;
  }

  if (query.fuelType) {
    filters.fuelType = query.fuelType;
  }

  if (query.isAuction === "true") {
    filters.isAuction = true;
  }

  return filters;
};

export const createCar = async (req, res, next) => {
  try {
    const auctionEndTime = req.body.isAuction
      ? req.body.auctionEndTime || new Date(Date.now() + 1000 * 60 * 60 * 24)
      : null;

    const car = await Car.create({
      ...req.body,
      owner: req.user._id,
      documents: {
        rc: "",
        insurance: "",
        idProof: "",
      },
      documentStatus: "pending",
      status: "pending",
      auctionEndTime,
      auctionStatus: req.body.isAuction ? "active" : "ended",
      availabilityStatus: "available",
      verified: false,
    });

    await createLog({
      action: "car created",
      userId: req.user._id,
      carId: car._id,
    });

    res.status(201).json({
      success: true,
      car: normalizeCar(car),
    });
  } catch (error) {
    next(error);
  }
};

export const getCars = async (req, res, next) => {
  try {
    const dbCars = await Car.find(mapFilters(req.query)).populate("owner", "name role");
    const syncedCars = await finalizeAuctionsForCars(dbCars);
    const cars = filterMarketplaceCars(syncedCars, req.user);

    res.json({
      success: true,
      source: dbCars.length ? "database" : "fallback",
      cars: dbCars.length ? cars : filterMarketplaceCars(fallbackCars, req.user),
    });
  } catch (error) {
    res.json({
      success: true,
      source: "fallback",
      cars: filterMarketplaceCars(fallbackCars, req.user),
    });
  }
};

export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate("owner", "name role");

    if (car) {
      const { car: syncedCar } = await finalizeAuctionIfNeeded(car);
      const normalizedCar = normalizeCar(syncedCar);

      if (!canViewCarDetails(req.user, normalizedCar)) {
        const error = new Error("Car not found");
        error.statusCode = 404;
        throw error;
      }

      return res.json({
        success: true,
        car: normalizedCar,
      });
    }

    const fallbackCar = fallbackCars.find((item) => item._id === req.params.id);

    if (!fallbackCar) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    if (!canViewCarDetails(req.user, fallbackCar)) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      car: normalizeCar(fallbackCar),
      source: "fallback",
    });
  } catch (error) {
    const fallbackCar = fallbackCars.find((item) => item._id === req.params.id);

    if (fallbackCar && canViewCarDetails(req.user, fallbackCar)) {
      return res.json({
        success: true,
        car: normalizeCar(fallbackCar),
        source: "fallback",
      });
    }

    next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    const isOwner = car.owner?.toString() === req.user._id.toString();
    const isPrivileged = ["admin", "dealer"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      const error = new Error("Not allowed to delete this listing");
      error.statusCode = 403;
      throw error;
    }

    await car.deleteOne();

    res.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    await finalizeAuctionIfNeeded(car);

    if (!isListingApproved(car)) {
      const error = new Error("Car must have verified documents and inspection before purchase");
      error.statusCode = 400;
      throw error;
    }

    const availabilityStatus = getAvailabilityStatus(car);

    if (availabilityStatus !== "available") {
      const error = new Error(
        availabilityStatus === "sold"
          ? "Car has already been sold"
          : "Car is not available for purchase"
      );
      error.statusCode = 400;
      throw error;
    }

    const { order } = await createMarketplaceOrder({
      buyerId: req.user._id,
      carId: car._id,
      finalPrice: car.price,
      paymentStatus: "completed",
      orderType: "direct",
    });

    if (car.isAuction) {
      car.auctionStatus = "ended";
      car.auctionEndTime = car.auctionEndTime || new Date();
    }
    car.availabilityStatus = "sold";
    await car.save();

    await createLog({
      action: "car purchased",
      userId: req.user._id,
      carId: car._id,
    });

    res.status(201).json({
      success: true,
      message: "Purchase completed",
      order,
    });
  } catch (error) {
    next(error);
  }
};
