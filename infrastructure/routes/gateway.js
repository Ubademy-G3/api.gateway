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
router.route("/courses/:id/users/:userId").delete(GatewayController.deleteUserFromCourse);
router.route("/courses/:id/users/:userId").patch(GatewayController.updateUserFromCourse);
router.route("/courses/:id/media").get(GatewayController.getAllCourseMedia);
router.route("/courses/:id/media").post(GatewayController.addCourseMedia);
router.route("/courses/:id/media/:mediaId").get(GatewayController.getCourseMedia);
router.route("/courses/:id/media/:mediaId").delete(GatewayController.deleteCourseMedia);
router.route("/courses/:id/ratings").get(GatewayController.getAllCourseRatings);
router.route("/courses/:id/ratings").post(GatewayController.addCourseRating);

module.exports = router;
