const Router = require("express");
const router = new Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, chatController.getData);

module.exports = router;
