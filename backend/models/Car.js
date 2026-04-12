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
    documents: {
      rc: {
        type: String,
        default: "",
      },
      insurance: {
        type: String,
        default: "",
      },
      idProof: {
        type: String,
        default: "",
      },
    },
    documentStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
    auctionEndTime: Date,
    auctionStatus: {
      type: String,
      enum: ["active", "ended"],
      default: "ended",
    },
    auctionEndsAt: Date,
    availabilityStatus: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

carSchema.pre("save", function syncVerificationState(next) {
  this.verified = this.status === "verified";

  if (this.isAuction) {
    this.auctionStatus = this.auctionStatus || "active";
  } else {
    this.auctionStatus = "ended";
  }

  next();
});

const Car = mongoose.model("Car", carSchema);

export default Car;
