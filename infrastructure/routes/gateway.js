const express = require("express");
const GatewayController = require("../../application/controllers/GatewayController");

const router = express.Router();

// auth
router.route("/authorization").post(GatewayController.signup);
router.route("/authentication").post(GatewayController.login);
router.route("/authentication/password").post(GatewayController.resetPassword);

// users
router.route("/users/:id").get(GatewayController.getUserById);
router.route("/users/:id").patch(GatewayController.updateUserInfo);

// courses
router.route("/courses").post(GatewayController.createCourse);
router.route("/courses").get(GatewayController.getAllCourses);
router.route("/courses/:id").patch(GatewayController.updateCourse);
router.route("/courses/:id").get(GatewayController.getCourse);
router.route("/courses/:id/users").post(GatewayController.addUserToCourse);
router.route("/courses/:id/users").get(GatewayController.getUsersFromCourse);

module.exports = router;
