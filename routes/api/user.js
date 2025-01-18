const express = require("express");
const router = express.Router();
const controller = require("../../controllers/userController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.get("/count", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), controller.getUsersCount);
router.get("/info", verifyRoles(ROLES_LIST.User), controller.getUserInfo);

module.exports = router;