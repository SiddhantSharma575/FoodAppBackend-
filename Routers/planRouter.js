const express = require("express");
const planRouter = express.Router();
const { protectRoute, isAuthorized } = require("../controller/authController");
const {
  getAllPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  top3Plans,
} = require("../controller/planController");

// all plans
planRouter.route("/allPlans").get(getAllPlans);

planRouter.use(protectRoute);
//own plan
planRouter.route("/plan/:id").get(getPlan);

planRouter.use(isAuthorized(["admin", "restaurantOwner"]));
planRouter.route("/crudPlan").post(createPlan);

planRouter.route("/crudPlan/:id").patch(updatePlan).delete(deletePlan);

// top three plans
planRouter.route("/topthree").get(top3Plans);
module.exports = planRouter;
