import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    transmission: {
      type: String,
      default: "",
    },
    fuelType: {
      type: String,
      default: "",
    },
    mileage: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    specs: {
      type: Object,
      default: {},
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
    auctionEndsAt: Date,
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

export default Car;

