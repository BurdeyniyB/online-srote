const Router = require("express");
const router = new Router();
const brandRouter = require("./brandRouter");
const deviceRouter = require("./deviceRouter");
const typeRouter = require("./typeRouter");
const userRouter = require("./userRouter");
const basketRouter = require("./basketRouter");
const ratingRouter = require("./ratingRouter");
const orderRouter = require("./orderRoutes");

router.use("/user", userRouter);
router.use("/device/type", typeRouter);
router.use("/device/brand", brandRouter);
router.use("/device/rating", ratingRouter);
router.use("/device", deviceRouter);
router.use("/basket", basketRouter);
router.use("/order", orderRouter);

module.exports = router;
