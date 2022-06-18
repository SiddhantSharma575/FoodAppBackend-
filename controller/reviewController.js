const reviewModel = require("../models/reviewModel");
const planModel = require("../models/planModels");

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) {
      return res.json({
        message: "Review Retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "Review Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.top3Reviews = async function top3Reviews(req, res) {
  try {
    const reviews = await reviewModel
      .find()
      .sort({
        rating: -1,
      })
      .limit(3);
    if (reviews) {
      return res.json({
        message: "Review Retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "Review Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  try {
    const id = req.params.id;
    const review = await reviewModel.findOne(id);
    if (review) {
      return res.json({
        message: "Review Retrieved",
        data: review,
      });
    } else {
      return res.json({
        message: "Review Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    let id = req.params.plan;
    let plan = planModel.findById(id);
    let review = await reviewModel.create(req.body);
    plan.ratingsAverage = (plan.ratingsAverage + req.body.rating) / 2;
    await review.save();
    res.json({
      message: "Review Created",
      data: review,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  try {
  } catch (err) {}
};
