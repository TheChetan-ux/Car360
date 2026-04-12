import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      alias: "userId",
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      alias: "carId",
    },
    amount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    sellerEarning: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "paid"],
      default: "pending",
    },
    orderType: {
      type: String,
      enum: ["direct", "auction"],
      default: "direct",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("validate", function syncPricing(next) {
  const finalPrice = Number(this.finalPrice || this.amount || 0);

  if (finalPrice > 0) {
    this.finalPrice = finalPrice;
    this.amount = finalPrice;
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
