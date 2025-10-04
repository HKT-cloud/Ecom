const express = require("express");
const userController = require("../Controller/user.controller");

const router = express.Router();

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.get("/logout", userController.logout);

module.exports = router;
