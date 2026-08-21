import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { errorHandler } from "./src/middleware/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import deliveryOptionRoutes from "./src/routes/deliveryOption.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://oc-frontend-seven.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart-items", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery-options", deliveryOptionRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware - must be last
app.use(errorHandler);

export default app;
