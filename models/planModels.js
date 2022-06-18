const express = require("express");
const app = express();
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = "siddhantSharma";
const crypto = require("crypto");
app.use(express.json());
app.use(cookieParser());

const db_link =
  "mongodb+srv://admin:HSMR1d25fzwvwIbt@cluster0.8bqiwym.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("Plan DB Connected");
  })
  .catch(function (err) {
    console.log("Error");
  });

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, "name should not exceed more than 20 characters"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "price not entered"],
  },
  ratingsAverage: {
    type: Number,
  },
  discount: {
    type: Number,
    validate: [
      function () {
        return this.discount < 100;
      },
      "discount should not exceed price",
    ],
  },
});
const planModel = mongoose.model("planModel", planSchema);

// (async function createPlan() {
//   let plan = {
//     name: "Superfood2",
//     duration: 30,
//     price: 2000,
//     ratingsAverage: 3,
//     discount: 50,
//   };
//   const doc = new planModel(plan);
//   await doc.save();
// })();

module.exports = planModel;
