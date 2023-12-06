const mongoose = require("mongoose");

const connectDB = (URL) => {
  mongoose.connect(URL);
  console.log("mongoDB connection was successful");
};

module.exports = connectDB;
