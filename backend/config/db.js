import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Atlas SRV lookups can time out on some Windows DNS setups.
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(`name: ${error.name}`);
    console.error(`message: ${error.message}`);
    throw error;
  }
};

export default connectDB;
