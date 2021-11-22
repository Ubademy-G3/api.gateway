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
router.route("/users/:id/courses").get(UsersController.getCourses);

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
router.route("/categories").get(CoursesController.getAllCategories);
router.route("/categories/:categoryId").get(CoursesController.getCategoryById);

// exams
router.route("/exams/").post(ExamsController.createExamTemplate);
router.route("/exams/:id").get(ExamsController.getExamTemplate);
router.route("/exams/:id").patch(ExamsController.updateExamTemplate);
router.route("/exams/:id").delete(ExamsController.deleteExamTemplate);
router.route("/exams/courses/:id").get(ExamsController.getAllExamsByCourseId);
router.route("/exams/:id/questions").post(ExamsController.addQuestionToExam);
router.route("/exams/:id/questions").get(ExamsController.getAllQuestionsFromExam);
router.route("/exams/:id/questions/:questionId").get(ExamsController.getExamQuestion);
router.route("/exams/:id/questions/:questionId").patch(ExamsController.editExamQuestion);
router.route("/exams/:id/questions/:questionId").delete(ExamsController.removeQuestionFromExam);
router.route("/exams/:id/solutions").get(ExamsController.getAllQuestionSolutions);
// problema: la ruta pide el param exam_template_id, pero no estan relacionadas esas tablas

module.exports = router;
