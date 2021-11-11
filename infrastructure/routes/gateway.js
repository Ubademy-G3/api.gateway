const express = require("express");
const GatewayController = require("../../application/controllers/GatewayController");

const router = express.Router();

// signup
router.route("/authorization").post(GatewayController.signup);
// login
router.route("/authentication").post(GatewayController.login);
// password reset
router.route("/authentication/password").post(GatewayController.resetPassword);
// users
router.route("/users/:id").get(GatewayController.getUserById);
router.route("/users/:id").patch(GatewayController.updateUserInfo);

module.exports = router;
