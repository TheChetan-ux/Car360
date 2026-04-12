import Car from "../models/Car.js";
import {
  getAvailabilityStatus,
  getDocumentStatus,
  normalizeCar,
} from "../utils/carState.js";
import { createLog } from "../utils/logUtils.js";

export const getPendingCars = async (_req, res, next) => {
  try {
    const cars = await Car.find().populate("owner", "name role").sort({ createdAt: -1 });
    const pendingCars = cars.map(normalizeCar).filter((car) => car.status === "pending");

    res.json({
      success: true,
      cars: pendingCars,
    });
  } catch (error) {
    next(error);
  }
};

const updateInspectionStatus = async (req, res, next, status) => {
  try {
    const car = req.car || (await Car.findById(req.params.id));

    if (!car) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    car.availabilityStatus = getAvailabilityStatus(car);
    car.status = status;
    await car.save();

    res.json({
      success: true,
      car: normalizeCar(car),
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    if (getDocumentStatus(car) !== "verified") {
      const error = new Error("Documents must be verified first");
      error.statusCode = 400;
      throw error;
    }

    req.car = car;
    await updateInspectionStatus(req, res, next, "verified");
    await createLog({
      action: "car approved",
      userId: req.user?._id,
      carId: car._id,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectCar = async (req, res, next) => {
  await updateInspectionStatus(req, res, next, "rejected");
};
