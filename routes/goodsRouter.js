const Router = require("express");
const router = new Router();
const goodsController = require("../controllers/goodsController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", authMiddleware, checkRole("ADMIN"), goodsController.create);
router.get("/all", goodsController.getAll);
router.get("/all/:id", goodsController.getProducts);
router.get("/:id", authMiddleware, goodsController.getOne);
router.delete(
  "/:id",
  authMiddleware,
  checkRole("ADMIN"),
  goodsController.deleteOne
);

module.exports = router;
