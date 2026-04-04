const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    if (mongoUri.startsWith("mongodb+srv://")) {
      error.message =
        `Unable to resolve the MongoDB SRV record for your Atlas cluster. ` +
        `If your network blocks SRV lookups, replace MONGO_URI with the standard ` +
        `"mongodb://host1,host2,host3/..." connection string from MongoDB Atlas. ` +
        `Original error: ${error.message}`;
    }

    throw error;
  }
};

module.exports = connectDB;
