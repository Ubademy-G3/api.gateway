const axios = require("axios");
const logger = require("../logger")("CoursesController.js");

const FREE_USER = "free";
const FREE_COURSE = "free";
const GOLD_USER = "gold";
const PREMIUM_COURSE = "premium";

const USER_TYPE_INSTRUCTOR = "instructor";

const userCantSubscribeToCourse = (userSubscription, courseSubscription) => (
  (userSubscription === GOLD_USER && courseSubscription === PREMIUM_COURSE)
  || (userSubscription === FREE_USER && courseSubscription !== FREE_COURSE)
);

const serializeQuery = (params, prefix) => {
  const query = params.map(((value) => `${prefix}${value}`));
  return query.join("&");
};

const queryUrl = (url, list, prefix) => {
  const params = serializeQuery(list, prefix);
  let result = url;
  if (params.length > 0) {
    result = result.concat(`?${params}`);
  }
  return result;
};

exports.createCourse = async (req, res) => {
  try {
    logger.info("Create new course");
    logger.debug(`Name of the new course: ${req.body.name}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const newCourse = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses`, req.body, { headers: { apikey: courses.apikey } });
    if (newCourse.status !== 201 && newCourse.status !== 200) {
      logger.warn(`Error ${newCourse.status}`);
      return res.status(newCourse.status).json(newCourse.data);
    }
    const newUserCourse = {
      user_id: req.body.user_id,
      user_type: USER_TYPE_INSTRUCTOR,
      progress: 0,
      aprobal_state: false,
    };
    await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${newCourse.data.id}/users/`, newUserCourse, { headers: { apikey: courses.apikey } });
    logger.info("New user created successfully");
    return res.status(200).json(newCourse.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when creating course ${req.body.name}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    logger.info("Update course");
    logger.debug(`Name of the course to update: ${req.body.name}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, req.body, { headers: { apikey: courses.apikey } });
    logger.info("Course updated successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating course ${req.body.name}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    logger.info("Get course by id");
    logger.debug(`ID of the searched course: ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseWithRating = async (req, res) => {
  try {
    logger.info("Get course with rating");
    logger.debug(`ID of the searched course: ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/rated/`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    logger.info("Get all courses");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses`, { params: { category: req.query.category, subscription_type: req.query.subscription_type, text: req.query.text }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting all courses");
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCoursesByList = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const url = queryUrl(`${process.env.COURSES_SERVICE_URL}/courses/list/`, req.query.id, "id=");
    const response = await axios.get(url, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCoursesWithRatings = async (req, res) => {
  try {
    logger.info("Get all courses with rating");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/rated/`, { params: { category: req.query.category, subscription_type: req.query.subscription_type, text: req.query.text }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting all courses with rating");
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addUserToCourse = async (req, res) => {
  try {
    logger.info("Add user to course");
    logger.debug(`Adding user with ID ${req.body.user_id} to the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.body.user_id}`, { headers: { Authorization: users.apikey } });
    const course = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: courses.apikey } });
    if (userCantSubscribeToCourse(user.data.subscription, course.data.subscription_type)) {
      logger.warn("Can't subscribe user because of subscription type");
      return res.status(403).json({ message: "Can't subscribe user because of subscription type" });
    }
    const response = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, req.body, { headers: { apikey: courses.apikey } });
    logger.info("User added successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when creating user ${req.body.email}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsersFromCourse = async (req, res) => {
  logger.info("Get users from a course");
  logger.debug(`Get all users from course: ${req.params.id}`);
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, { params: { user_type: req.query.user_type, approval_state: req.query.approval_state, progress: req.query.progress }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting users from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUserFromCourse = async (req, res) => {
  try {
    logger.info("Delete user from a course");
    logger.debug(`Delete user with ID ${req.params.userId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users/${req.params.userId}`, { headers: { apikey: courses.apikey } });
    logger.info("User deleted successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when deleting user ${req.params.userId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserFromCourse = async (req, res) => {
  try {
    logger.info("Update user from a course");
    logger.debug(`Update user with ID ${req.params.userId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users/${req.params.userId}`, req.body, { headers: { apikey: courses.apikey } });
    logger.info("User updated successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating user ${req.params.userId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addCourseMedia = async (req, res) => {
  try {
    logger.info("Add media content to course");
    logger.debug(`Add content with url "${req.body.url}" to course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when adding media ${req.body.url} to course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourseMedia = async (req, res) => {
  try {
    logger.info("Get all media content from course");
    logger.debug(`Get all media from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all media from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseMedia = async (req, res) => {
  try {
    logger.info("Get media content from course by id");
    logger.debug(`Get media with id ${req.params.mediaId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/${req.params.mediaId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting media ${req.params.mediaId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getModuleMedia = async (req, res) => {
  try {
    logger.info("Get media content from course by module id");
    logger.debug(`Get media content with module id ${req.params.moduleId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/module/${req.params.moduleId}/`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting media with module id ${req.params.moduleId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCourseMedia = async (req, res) => {
  try {
    logger.info("Delete media content from course");
    logger.debug(`Delete media content with id ${req.params.mediaId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/${req.params.mediaId}`, { headers: { apikey: courses.apikey } });
    logger.info("Media content deleted successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when deleting media content ${req.params.mediaId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addCourseRating = async (req, res) => {
  try {
    logger.info("Add review/rating to a course");
    logger.debug(`The user ${req.body.user_id} gave their opinion about the course ${req.params.id}`);
    logger.debug(`Opinion: "${req.body.opinion}"`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/ratings`, req.body, { headers: { apikey: courses.apikey } });
    logger.info("Review added successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when adding review to course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourseRatings = async (req, res) => {
  try {
    logger.info("Get all reviews from a course");
    logger.debug(`Get all reviews from the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/ratings`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all reviews from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    logger.info("Get course category by id");
    logger.debug(`Get category with id ${req.params.categoryId}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/category/${req.params.categoryId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting category with id ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllCategories = async (_req, res) => {
  try {
    logger.info("Get all categories of the courses");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/category/`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting all categories");
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCourseModule = async (req, res) => {
  try {
    logger.info("Add new module to a course");
    logger.debug(`Add module with title "${req.body.title}" to the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const newModule = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/modules/`, req.body, { headers: { apikey: courses.apikey } });
    logger.info("New module added successfully");
    return res.status(200).json(newModule.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when creating module ${req.body.title} to the course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseModule = async (req, res) => {
  try {
    logger.info("Get module from a course by id");
    logger.debug(`Get module ${req.params.moduleId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/modules/${req.params.moduleId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting module ${req.params.moduleId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllModulesByCourse = async (req, res) => {
  try {
    logger.info("Get all modules from a course");
    logger.debug(`Get all modules from the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/modules/`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all modules from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCourseModule = async (req, res) => {
  try {
    logger.info("Delete course module from a course");
    logger.debug(`Delete modules ${req.params.moduleId} from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/modules/${req.params.moduleId}`, { headers: { apikey: courses.apikey } });
    logger.info("Module deleted successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when deleting module ${req.params.moduleId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCourseModule = async (req, res) => {
  try {
    logger.info("Update module of a course");
    logger.debug(`Update module ${req.params.moduleId} of course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/modules/${req.params.moduleId}`, req.body, { headers: { apikey: courses.apikey } });
    logger.info("Module updated successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating module ${req.params.moduleId} from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseMetrics = async (req, res) => {
  try {
    logger.info("Get metrics from a course");
    logger.debug(`Get metrics from the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/metrics`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.detail}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting metrics from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSolvedExams = async (req, res) => {
  try {
    logger.info("Get solved exams from a course");
    logger.debug(`Get solved exams from the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/course/${req.params.id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state }, headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting solved exams from course ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
