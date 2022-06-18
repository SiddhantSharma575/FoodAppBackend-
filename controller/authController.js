const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const JWT_KEY = "siddhantSharma";
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

module.exports.signUp = async function signUp(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    if (user) {
      return res.json({
        message: "User Sign Up",
        data: user,
      });
    } else {
      return res.json({
        message: "User Already Exists",
      });
    }
  } catch (error) {
    res.json({
      message: `Failed to Sign Up ${error.message} `,
    });
  }
};

module.exports.login = async function login(req, res) {
  try {
    let data = req.body;
    if (data.email) {
      let user = await userModel.findOne({ email: data.email });
      if (user) {
        let resa = await bcrypt.compare(data.password, user.password);
        if (resa) {
          let uid = user["_id"];
          let token = jwt.sign(
            {
              payload: uid,
            },
            JWT_KEY
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

// isAuthorized Function to check user's role
module.exports.isAuthorized = function isAuthorized(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        message: "Unautorized access",
      });
    }
  };
};

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    let token;
    if (req.cookies.login) {
      token = req.cookies.login;
      let payload = jwt.verify(token, JWT_KEY);
      if (payload) {
        const user = await userModel.findById(payload.payload);
        req.role = user.role;
        req.id = user.id;
        next();
      } else {
        return res.json({
          message: "User NOT verified",
        });
      }
    } else {
      const client = req.get("User-Agent");
      if (client.includes("Mozilla") == true) {
        return res.redirect("/login");
      }
      return res.json({
        message: "Please Logged In",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

//forget Password
module.exports.forgetPassword = async function forgetPassword(req, res) {
  let { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const resetToken = user.createResetToken();
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}/resetpassword/${resetToken}`;
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    let { password, confirmPassword } = req.body;
    const user = await userModel.findOne({
      resetToken: token,
    });
    user.resetPasswordHandler(password, confirmPassword);
    await user.save();
    res.json({
      message: "Password Cbanged Successfuly",
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.logout = function logout(req, res) {
  res.cookie("login", "", {
    maxAge: 1,
  });
  res.json({
    message: "User LogOut Successfully",
  });
};
