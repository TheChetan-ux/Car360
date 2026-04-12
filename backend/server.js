import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import inspectorRoutes from "./routes/inspectorRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import { uploadsDir } from "./middleware/uploadMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  const readyStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    message: "Car360 API is running",
    database: readyStates[mongoose.connection.readyState] || "unknown",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/inspector", inspectorRoutes);
app.use("/api/documents", documentRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Car360 API running on port ${PORT}`);
    });
  } catch (_error) {
    process.exit(1);
  }
};

startServer();
