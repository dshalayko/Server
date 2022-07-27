const Router = require("express");
const router = new Router();
const express = require('express');
const app = express();

// app.use(express.json());
const catalogController = require("../controllers/catalogController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


router.post("/", authMiddleware, checkRole("ADMIN"), catalogController.create);
router.get("/all", catalogController.getAll);
router.get("/:id", authMiddleware, catalogController.getOne);
router.delete(
  "/:id",
  authMiddleware,
  checkRole("ADMIN"),
  catalogController.deleteOne
);

module.exports = router;
