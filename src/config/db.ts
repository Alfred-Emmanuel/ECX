const mongoose = require("mongoose");

export const connectDb = async () => {
  try {
    const conn = mongoose.connect("mongodb://localhost:27017");

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
