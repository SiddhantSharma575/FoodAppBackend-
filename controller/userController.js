const express = require("express");
const app = express();
const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

module.exports.getUsers = async function getUsers(req, res) {
  let allUsers = await userModel.find();
  res.json({
    message: "List of all Users",
    data: allUsers,
  });
};

module.exports.getUser = async function getUser(req, res) {
  let id = req.params.id;
  let user = await userModel.findById(id);
  if (user) {
    return res.json(user);
  } else {
    return res.json({
      message: "User Not Found",
    });
  }
};

module.exports.postUser = async function postUser(req, res) {
  let dataObj = req.body;
  let user = await userModel.create(dataObj);
  res.json({
    message: "User Added Succesfully",
    data: user,
  });
};

module.exports.updateUser = async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findById(id);
    let dataToBeUpdated = req.body;
    if (user) {
      const keys = [];
      for (let key in dataToBeUpdated) {
        keys.push(key);
      }
      for (let i = 0; i < keys.length; i++) {
        user[keys[i]] = dataToBeUpdated[keys[i]];
      }

      const updatedData = await userModel.findByIdAndUpdate(
        req.params.id,
        user
      );
      res.json({
        message: "Data Updated Successfully",
        user,
      });
    } else {
      res.json({
        message: "User Not Found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    if (!user) {
      res.json({
        message: "User Not Found",
      });
    } else {
      res.json({
        message: "Data Deleted Successfully",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

module.exports.getCookies = function getCookies(req, res) {
  let cookies = req.cookies;
  console.log(cookies);
  res.send("cookies received");
};

module.exports.setCookies = function setCookies(req, res) {
  // res.setHeader("Set-Cookie", "isLoggedIn=true");
  res.cookie("isLoggedIn", true, {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    httpOnly: true,
  });
  res.cookie("isPrimeMember", true);
  res.send("cookies has been set");
};

module.exports.loginUser = async function loginUser(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        if (user.password == data.password) {
          let uid = user["_id"];
          let token = jwt.sign(
            {
              payload: uid,
            },
            key
          );
          res.cookie("login", token, { httpOnly: true });

          return res.json({
            message: "User has Logged In",
            userDetails: data,
          });
        } else {
          return res.json({
            message: "Wrong Credentials",
          });
        }
      } else {
        return res.status(500).json({
          message: "User Not Found",
        });
      }
    } else {
      return res.json({
        message: "Please Provide Email",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

// let flag = true; //user logged in or not
module.exports.protectRoute = function protectRoute(req, res, next) {
  if (req.cookies.login) {
    let isuserVerifed = jwt.verify(req.cookies.login, key);
    if (isuserVerifed) {
      next();
    } else {
      return res.json({
        message: "User not verified",
      });
    }
  } else {
    return res.json({
      message: "Please Logged In",
    });
  }
};
