import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import itemRoutes from "./routes/items.route.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Use these lines to define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cookieParser());

// Maintenance mode flag
const isMaintenanceMode = false;

// Middleware for maintenance mode
app.use((req, res, next) => {
  if (isMaintenanceMode) {
    res
      .status(503)
      .sendFile(
        path.join(__dirname, "../client/public/errorpages", "Maintenance.html")
      );
  } else {
    next();
  }
});

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, "../client/dist")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Catch-all to serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// Catch-all for unhandled API routes
app.use((req, res, next) => {
  res
    .status(404)
    .sendFile(
      path.join(__dirname, "../client/public/errorpages", "404NotFound.html")
    );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .sendFile(
      path.join(__dirname, "../client/public/errorpages", "500ServerError.html")
    );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
