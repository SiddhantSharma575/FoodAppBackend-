const express = require("express");
const app = express();
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const key = "siddhantSharma";
app.use(express.json());
app.use(cookieParser());
const userRouter = express.Router();
const {
  getUsers,
  postUser,
  deleteUser,
  updateUser,
  getUser,
} = require("../controller/userController");

const {
  protectRoute,
  isAuthorized,
  login,
  signUp,
  resetPassword,
  forgetPassword,
  logout,
} = require("../controller/authController");

// user ke option
userRouter.route("/:id").patch(updateUser).delete(deleteUser);

userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(login);

userRouter.route("/forgetpassword").post(forgetPassword);

userRouter.route("/resetPassword/:token").post(resetPassword);

userRouter.route("/logout").get(logout);

userRouter.use(protectRoute);
//get profile page
userRouter.route("/userProfile").get(getUser);

// admin specifice work
userRouter.use(isAuthorized(["admin"]));
userRouter.route("/").get(getUsers);

module.exports = userRouter;
