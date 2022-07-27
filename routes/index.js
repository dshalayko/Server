const Router = require("express");
const router = new Router();
const goodsRouter = require("./goodsRouter");
const catalogRouter = require("./catalogRouter");
const userRouter = require("./userRouter");
const managerRouter = require("./managerRouter");
const ordersRouter = require("./ordersRouter");
const chatRouter = require("./chatRouter");

router.use("/user", userRouter);
router.use("/goods", goodsRouter);
router.use("/catalog", catalogRouter);
router.use("/manager", managerRouter);
router.use("/order", ordersRouter);
router.use("/chat", chatRouter);

module.exports = router;
