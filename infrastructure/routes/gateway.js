const express = require("express");
const AuthController = require("../../application/controllers/AuthController");
const UsersController = require("../../application/controllers/UsersController");
const CoursesController = require("../../application/controllers/CoursesController");
const ExamsController = require("../../application/controllers/ExamsController");

const router = express.Router();

// auth
router.route("/authorization").post(AuthController.signup);
router.route("/authentication").post(AuthController.login);
router.route("/authentication/password").post(AuthController.resetPassword);

// users
router.route("/users/:id").get(UsersController.getUserById);
router.route("/users/:id").patch(UsersController.updateUserInfo);

// courses
router.route("/courses").post(CoursesController.createCourse);
router.route("/courses").get(CoursesController.getAllCourses);
router.route("/courses/:id").patch(CoursesController.updateCourse);
router.route("/courses/:id").get(CoursesController.getCourse);
router.route("/courses/:id/users").post(CoursesController.addUserToCourse);
router.route("/courses/:id/users").get(CoursesController.getUsersFromCourse);
router.route("/courses/:id/users/:userId").delete(CoursesController.deleteUserFromCourse);
router.route("/courses/:id/users/:userId").patch(CoursesController.updateUserFromCourse);
router.route("/courses/:id/media").get(CoursesController.getAllCourseMedia);
router.route("/courses/:id/media").post(CoursesController.addCourseMedia);
router.route("/courses/:id/media/:mediaId").get(CoursesController.getCourseMedia);
router.route("/courses/:id/media/:mediaId").delete(CoursesController.deleteCourseMedia);
router.route("/courses/:id/ratings").get(CoursesController.getAllCourseRatings);
router.route("/courses/:id/ratings").post(CoursesController.addCourseRating);

// exams
router.route("/exams/templates").post(ExamsController.createExamTemplate);
router.route("/exams/templates/:id").get(ExamsController.getExamTemplate);
router.route("/exams/templates/:id").patch(ExamsController.updateExamTemplate);
router.route("/exams/templates/:id").delete(ExamsController.deleteExamTemplate);

module.exports = router;
