import Order from "../models/Order.js";

export const COMMISSION_RATE = 0.05;

export const calculateCommissionBreakdown = (finalPrice) => {
  const normalizedPrice = Number(finalPrice || 0);
  const commissionAmount = Number((normalizedPrice * COMMISSION_RATE).toFixed(2));
  const sellerEarning = Number((normalizedPrice - commissionAmount).toFixed(2));

  return {
    finalPrice: normalizedPrice,
    commissionAmount,
    sellerEarning,
  };
};

export const createMarketplaceOrder = async ({
  buyerId,
  carId,
  finalPrice,
  paymentStatus = "completed",
  orderType = "direct",
  throwIfExists = true,
}) => {
  const existingOrder = await Order.findOne({ car: carId });

  if (existingOrder) {
    if (throwIfExists) {
      const error = new Error("Order already exists for this car");
      error.statusCode = 400;
      throw error;
    }

    return {
      order: existingOrder,
      created: false,
    };
  }

  const pricing = calculateCommissionBreakdown(finalPrice);
  const order = await Order.create({
    buyer: buyerId,
    car: carId,
    amount: pricing.finalPrice,
    finalPrice: pricing.finalPrice,
    commissionAmount: pricing.commissionAmount,
    sellerEarning: pricing.sellerEarning,
    paymentStatus,
    orderType,
  });

  return {
    order,
    created: true,
  };
};
