const express = require("express");
const router = express.Router();
const controller = require("../../controllers/userController");

router.get("/count", controller.getUsersCount);
router.get("/info", controller.getUserInfo);

module.exports = router;