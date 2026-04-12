import Car from "../models/Car.js";
import {
  hasAllRequiredDocuments,
  normalizeCar,
  normalizeDocuments,
} from "../utils/carState.js";
import { createLog } from "../utils/logUtils.js";

const getUploadedPath = (file) => (file ? `/uploads/${file.filename}` : "");

export const uploadCarDocuments = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    if (car.owner?.toString() !== req.user._id.toString()) {
      const error = new Error("You can only upload documents for your own listing");
      error.statusCode = 403;
      throw error;
    }

    const uploadedFiles = req.files || {};

    if (!uploadedFiles.rc && !uploadedFiles.insurance && !uploadedFiles.idProof) {
      const error = new Error("Upload at least one document file");
      error.statusCode = 400;
      throw error;
    }

    const currentDocuments = normalizeDocuments(car.documents);

    car.documents = {
      rc: getUploadedPath(uploadedFiles.rc?.[0]) || currentDocuments.rc,
      insurance: getUploadedPath(uploadedFiles.insurance?.[0]) || currentDocuments.insurance,
      idProof: getUploadedPath(uploadedFiles.idProof?.[0]) || currentDocuments.idProof,
    };
    car.documentStatus = "pending";

    await car.save();

    res.json({
      success: true,
      car: normalizeCar(car),
    });
  } catch (error) {
    next(error);
  }
};

const updateDocumentStatus = async (req, res, next, status) => {
  try {
    const car = await Car.findById(req.params.carId);

    if (!car) {
      const error = new Error("Car not found");
      error.statusCode = 404;
      throw error;
    }

    if (status === "verified" && !hasAllRequiredDocuments(car)) {
      const error = new Error("All required documents must be uploaded before verification");
      error.statusCode = 400;
      throw error;
    }

    car.documentStatus = status;
    await car.save();

    res.json({
      success: true,
      car: normalizeCar(car),
    });
  } catch (error) {
    next(error);
  }
};

export const verifyDocuments = async (req, res, next) => {
  await updateDocumentStatus(req, res, next, "verified");
  await createLog({
    action: "documents verified",
    userId: req.user?._id,
    carId: req.params.carId,
  });
};

export const rejectDocuments = async (req, res, next) => {
  await updateDocumentStatus(req, res, next, "rejected");
};
