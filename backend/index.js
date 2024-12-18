const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)

  /* no need for that anymore
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } */
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });



app.listen(8800, () => {
  console.log("Backend server is running!");
});
