import Car from "../models/Car.js";
import Order from "../models/Order.js";
import fallbackCars from "../data/fallbackCars.js";

const mapFilters = (query) => {
  const filters = { status: "available" };

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
    const car = await Car.create({
      ...req.body,
      owner: req.user._id,
      verified: req.user.role === "dealer" || req.user.role === "admin",
    });

    res.status(201).json({
      success: true,
      car,
    });
  } catch (error) {
    next(error);
  }
};

export const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find(mapFilters(req.query)).populate("owner", "name role");

    res.json({
      success: true,
      source: cars.length ? "database" : "fallback",
      cars: cars.length ? cars : fallbackCars,
    });
  } catch (error) {
    res.json({
      success: true,
      source: "fallback",
      cars: fallbackCars,
    });
  }
};

export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate("owner", "name role");

    if (car) {
      return res.json({
        success: true,
        car,
      });
    }

    const fallbackCar = fallbackCars.find((item) => item._id === req.params.id);

    if (!fallbackCar) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      car: fallbackCar,
      source: "fallback",
    });
  } catch (error) {
    const fallbackCar = fallbackCars.find((item) => item._id === req.params.id);

    if (fallbackCar) {
      return res.json({
        success: true,
        car: fallbackCar,
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

    if (car.status === "sold") {
      const error = new Error("Car has already been sold");
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.create({
      buyer: req.user._id,
      car: car._id,
      amount: car.price,
      paymentStatus: "paid",
    });

    car.status = "sold";
    await car.save();

    res.status(201).json({
      success: true,
      message: "Purchase completed",
      order,
    });
  } catch (error) {
    next(error);
  }
};
