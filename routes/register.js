const express = require("express");
const router = express.Router();
const controller = require("../controllers/registerController");

router.post("/", controller.handleRegistration);

module.exports = router;