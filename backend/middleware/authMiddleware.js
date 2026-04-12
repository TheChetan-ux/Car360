import jwt from "jsonwebtoken";
import User from "../models/User.js";

const attachUserFromToken = async (req, strict = true) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (!strict) {
      return null;
    }

    const error = new Error("Not authorized, token missing");
    error.statusCode = 401;
    throw error;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    return user;
  } catch (error) {
    if (!strict) {
      req.user = null;
      return null;
    }

    throw error;
  }
};

export const protect = async (req, _res, next) => {
  try {
    await attachUserFromToken(req, true);
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalProtect = async (req, _res, next) => {
  try {
    await attachUserFromToken(req, false);
    next();
  } catch (error) {
    next(error);
  }
};

export const allowRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error("You do not have permission to perform this action");
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
