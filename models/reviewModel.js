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

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review is Required"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Rating is Required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: [true, "review must belong to a user"],
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: "planModel",
    required: [true, "review must belong to a plan"],
  },
});

reviewSchema.pre("/^find/", function (next) {
  this.populate({
    path: "user",
    select: "name profileImage",
  }).populate("plan");
  next();
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;
