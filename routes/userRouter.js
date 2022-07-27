const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/cheak_login", userController.checkLogin);
router.get("/auth", authMiddleware, userController.check);
router.get("/all", checkRole("ADMIN"), userController.getAll);
router.get(
  "/unverified",
  checkRole("ADMIN"),
  userController.getUnverifiedUsers
);
router.get("/:id", checkRole("ADMIN"), userController.getOne);
router.delete("/:id", checkRole("ADMIN"), userController.deleteOne);
router.post(
  "/:id/verificate",
  checkRole("ADMIN"),
  userController.verificateUser
);

module.exports = router;
