const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const { isDatabaseReady } = require("./middleware/dbMiddleware");
require("./models/category");

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}))
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        ok: true,
        databaseReady: isDatabaseReady(),
    });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use('/api/payment', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.error("Server will continue running, but database-backed routes will return 503.");
    }

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
