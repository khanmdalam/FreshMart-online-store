const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/productControllers");
const { protect } = require("../middleware/authMiddleware");
const { requireDatabase } = require("../middleware/dbMiddleware");

// PUBLIC ROUTES
router.get("/", requireDatabase, getProducts);
router.get("/category/:categoryId", requireDatabase, getProductsByCategory);
router.get("/:id", requireDatabase, getProductById);

// PROTECTED ROUTES (admin only)
router.post("/", requireDatabase, protect, createProduct);
router.delete("/:id", requireDatabase, protect, deleteProduct);

module.exports = router;
