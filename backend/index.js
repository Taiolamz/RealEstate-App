import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";

const app = express();
const port = 8080;
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to MongoDB");
  } catch {
    throw error;
  }
};

// midleware
app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/hotels", hotelsRoute);
app.use("/api/v1/rooms", roomsRoute);
app.use("/api/v1/users", usersRoute);

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.Message || "Something went wrong!";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB is disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB is connected!");
});

app.listen(port, () => {
  connect();
  console.log("Connected to the backend");
});
