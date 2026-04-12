import Log from "../models/Log.js";

export const createLog = async ({ action, userId = null, carId = null }) => {
  try {
    await Log.create({
      action,
      userId,
      carId,
    });
  } catch (error) {
    console.error(`Log write failed for action "${action}":`, error.message);
  }
};
