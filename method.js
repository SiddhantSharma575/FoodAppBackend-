const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

const userRouter = require("./Routers/userRouter");
const planRouter = require("./Routers/planRouter");
const reviewRouter = require("./Routers/reviewRouter");
app.use("/users", userRouter);

// const planModel = require("./models/planModels");
app.use("/plans", planRouter);
app.use("/reviews", reviewRouter);

app.listen(3000, () => {
  console.log("App Running at PORT 3000");
});
