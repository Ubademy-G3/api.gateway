const express = require("express");
const AuthController = require("../../application/controllers/AuthController");
const UsersController = require("../../application/controllers/UsersController");
const CoursesController = require("../../application/controllers/CoursesController");
const ExamsController = require("../../application/controllers/ExamsController");
const MetricsController = require("../../application/controllers/MetricsController");

const router = express.Router();

// auth
router.route("/authorization").post(AuthController.signup);
router.route("/authentication").post(AuthController.login);
router.route("/authentication/password").post(AuthController.resetPassword);

// users
router.route("/users/:id").get(UsersController.getUserById);
router.route("/users/:id").patch(UsersController.updateUserInfo);
router.route("/users/:id/courses").get(UsersController.getCourses);
router.route("/users/:id/solved-exams").get(UsersController.getSolvedExams);
router.route("/users/:id/exams").get(UsersController.getExams);
router.route("/users").get(UsersController.getAllUsers);

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
router.route("/courses/:id/modules").post(CoursesController.createCourseModule);
router.route("/courses/:id/modules/:moduleId").get(CoursesController.getCourseModule);
router.route("/courses/:id/modules/:moduleId").delete(CoursesController.deleteCourseModule);
router.route("/courses/:id/modules/:moduleId").patch(CoursesController.updateCourseModule);
router.route("/courses/:id/metrics").get(CoursesController.getCourseMetrics);
router.route("/courses/:id/solved-exams").get(CoursesController.getSolvedExams);

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
router.route("/exams/:id/solutions").post(ExamsController.addExamSolutions);
router.route("/exams/:id/solutions").get(ExamsController.getAllExamSolutions);
router.route("/exams/:id/solutions/:solutionId").get(ExamsController.getExamSolution);
router.route("/exams/:id/solutions/:solutionId/answers").get(ExamsController.getAllExamAnswers);
router.route("/exams/:id/solutions/:solutionId/answers").post(ExamsController.addExamAnswer);
router.route("/exams/:id/solutions/:solutionId/answers/:answerId").get(ExamsController.getExamAnswer);

// metrics
router.route("/metrics/courses/").get(MetricsController.getAllCourseMetrics);
router.route("/metrics/courses/:id").get(MetricsController.getCourseMetricsByCourseID);
router.route("/metrics/users/").get(MetricsController.getAllUserMetrics);
router.route("/metrics/users/:id").get(MetricsController.getUserMetricsByUserID);
router.route("/metrics/payments/").get(MetricsController.getAllPaymentMetrics);

module.exports = router;
