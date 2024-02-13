const express = require("express");
const UserController = require("../controller/UserController");

const router = express.Router();

router.post("/signup-customer", UserController.signup);
router.post("/login-customer", UserController.login);


module.exports = router;
