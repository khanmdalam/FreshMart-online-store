const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { isDatabaseReady } = require("./middleware/dbMiddleware");

require("./models/category");

const app = express();
const port = Number(process.env.PORT) || 5000;

// ✅ FIXED CORS (IMPORTANT)
app.use(cors({
  origin: ["https://freshmart-pink-nine.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    databaseReady: isDatabaseReady(),
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("Server will continue running, but DB routes may fail.");
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();