const Router = require("express");
const router = new Router();
const managerController = require("../controllers/managersController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/create", checkRole("ADMIN"), managerController.createManager);
router.get("/all", checkRole("ADMIN"), managerController.getAll);
router.post("/delete", checkRole("ADMIN"), managerController.deleteOne);
router.get(
  "/freemanager",
  checkRole("ADMIN"),
  managerController.getLessBusyManager
);
router.get("/:id", checkRole("ADMIN"), managerController.getOne);

module.exports = router;
