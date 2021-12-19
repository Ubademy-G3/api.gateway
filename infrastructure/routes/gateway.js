const express = require("express");
const AuthController = require("../../application/controllers/AuthController");
const UsersController = require("../../application/controllers/UsersController");
const CoursesController = require("../../application/controllers/CoursesController");
const ExamsController = require("../../application/controllers/ExamsController");
const MetricsController = require("../../application/controllers/MetricsController");
const AdminController = require("../../application/controllers/AdminController");
const PaymentsController = require("../../application/controllers/PaymentsController");

const router = express.Router();

// auth
router.route("/authorization").post(AuthController.signup);
router.route("/authentication").post(AuthController.login);
router.route("/authentication/password").post(AuthController.resetPassword);

// users
router.route("/users/:id").get(UsersController.getUserById);
router.route("/users/:id").patch(UsersController.updateUserInfo);
router.route("/users/:id/courses").get(UsersController.getCourses);
router.route("/users/:id/favorites").get(UsersController.getFavoriteCourses);
router.route("/users/:id/solved-exams").get(UsersController.getSolvedExams);
router.route("/users/:id/exams").get(UsersController.getExams);
router.route("/users").get(UsersController.getAllUsers);
router.route("/users/:id/wallet").post(UsersController.createWallet);
router.route("/users/:id/wallet").get(UsersController.getUserWallet);
router.route("/users/:id/deposit").post(UsersController.makeDeposit);

// courses
router.route("/courses").post(CoursesController.createCourse);
router.route("/courses").get(CoursesController.getAllCourses);
router.route("/courses/rated").get(CoursesController.getAllCoursesWithRatings);
router.route("/courses/:id").patch(CoursesController.updateCourse);
router.route("/courses/:id").get(CoursesController.getCourse);
router.route("/courses/:id/rated").get(CoursesController.getCourseWithRating);
router.route("/courses/:id/users").post(CoursesController.addUserToCourse);
router.route("/courses/:id/users").get(CoursesController.getUsersFromCourse);
router.route("/courses/:id/users/:userId").delete(CoursesController.deleteUserFromCourse);
router.route("/courses/:id/users/:userId").patch(CoursesController.updateUserFromCourse);
router.route("/courses/:id/media").get(CoursesController.getAllCourseMedia);
router.route("/courses/:id/media").post(CoursesController.addCourseMedia);
router.route("/courses/:id/media/:mediaId").get(CoursesController.getCourseMedia);
router.route("/courses/:id/media/module/:moduleId").get(CoursesController.getModuleMedia);
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
router.route("/courses/:id/modules").get(CoursesController.getAllModulesByCourse);

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
router.route("/exams/:id/solutions/:solutionId").patch(ExamsController.updateExamSolution);
router.route("/exams/:id/solutions/:solutionId/answers").get(ExamsController.getAllExamAnswers);
router.route("/exams/:id/solutions/:solutionId/answers").post(ExamsController.addExamAnswer);
router.route("/exams/:id/solutions/:solutionId/answers/:answerId").get(ExamsController.getExamAnswer);
router.route("/exams/:id/solutions/:solutionId/answers/:answerId").patch(ExamsController.updateExamAnswer);

// metrics
router.route("/metrics/courses/").get(MetricsController.getAllCourseMetrics);
router.route("/metrics/courses/:id").get(MetricsController.getCourseMetricsByCourseID);
router.route("/metrics/users/").get(MetricsController.getAllUserMetrics);
router.route("/metrics/users/:id").get(MetricsController.getUserMetricsByUserID);
router.route("/metrics/payments/").get(MetricsController.getAllPaymentMetrics);

// admin
router.route("/microservices/").post(AdminController.createMicroservice);
router.route("/microservices/:id").get(AdminController.getMicroservice);
router.route("/microservices/:id").patch(AdminController.updateMicroservice);
router.route("/microservices/:id").delete(AdminController.deleteMicroservice);
router.route("/microservices/").get(AdminController.getAllMicroservices);

// payments
router.route("/deposits").get(PaymentsController.getAllDeposits);

module.exports = router;
