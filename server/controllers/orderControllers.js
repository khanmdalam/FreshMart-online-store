const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Calculate total and check stock for DB-backed products.
    // For non-DB/cart-only items, save item snapshot so order tracking still works.
    let totalAmount = 0;
    const normalizedItems = [];

    for (let item of items) {
      const quantity = Number(item.quantity) || 1;
      const clientPrice = Number(item.price) || 0;
      let savedItem = {
        quantity,
        price: clientPrice,
        productName: item.name || "Product",
        productImage: item.image || item.imageURL || "",
      };

      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        const product = await Product.findById(item.product);
        if (product) {
          if (product.stock < quantity) {
            return res.status(400).json({ message: `${product.name} is out of stock` });
          }

          product.stock -= quantity;
          await product.save();

          savedItem = {
            ...savedItem,
            product: product._id,
            productName: product.name,
            productImage: product.imageURL,
            price: product.price,
          };
        }
      }

      totalAmount += savedItem.price * quantity;
      normalizedItems.push(savedItem);
    }

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      totalAmount,
      deliveryAddress,
      paymentStatus: "paid",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
