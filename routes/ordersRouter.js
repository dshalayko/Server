const Router = require("express");
const router = new Router();
const orderController = require("../controllers/ordersController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, orderController.createOrder);
router.get("/all", checkRole("ADMIN"), orderController.getAll);
router.delete("/:id", checkRole("ADMIN"), orderController.deleteOne);
router.get("/:id", checkRole("ADMIN"), orderController.getOne);
router.get("/update/:id/:status", checkRole("ADMIN"), orderController.updateOne);

module.exports = router;
