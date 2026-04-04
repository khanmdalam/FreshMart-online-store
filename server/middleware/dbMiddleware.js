const mongoose = require("mongoose");

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const requireDatabase = (req, res, next) => {
  if (isDatabaseReady()) {
    return next();
  }

  return res.status(503).json({
    message:
      "Database is unavailable. Check MONGO_URI or use a MongoDB connection that this machine can reach.",
  });
};

module.exports = { isDatabaseReady, requireDatabase };
