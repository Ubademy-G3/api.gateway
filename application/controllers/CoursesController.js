const axios = require("axios");

const FREE_USER = "free";
const FREE_COURSE = "free";
const GOLD_USER = "gold";
const PREMIUM_COURSE = "premium";

const USER_TYPE_INSTRUCTOR = "instructor";

const userCantSubscribeToCourse = (userSubscription, courseSubscription) => (
  (userSubscription === GOLD_USER && courseSubscription === PREMIUM_COURSE)
  || (userSubscription === FREE_USER && courseSubscription !== FREE_COURSE)
);

exports.createCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const newCourse = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses`, req.body, { headers: { apikey: courses.apikey } });
    if (newCourse.status !== 201 && newCourse.status !== 200) {
      return res.status(newCourse.status).json(newCourse.data);
    }
    const newUserCourse = {
      user_id: req.body.user_id,
      user_type: USER_TYPE_INSTRUCTOR,
      progress: 0,
      aprobal_state: false,
    };
    await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${newCourse.data.id}/users/`, newUserCourse, { headers: { apikey: courses.apikey } });
    return res.status(200).json(newCourse.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses`, { params: { category: req.query.category, subscription_type: req.query.subscription_type, text: req.query.text }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addUserToCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (users.state !== "active") {
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.body.user_id}`, { headers: { Authorization: users.apikey } });
    const course = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: courses.apikey } });
    if (userCantSubscribeToCourse(user.data.subscription, course.data.subscription_type)) {
      return res.status(403).json({ message: `Can't subscribe user with subscription type ${user.data.subscription} to ${course.data.subscription_type} course` });
    }
    const response = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsersFromCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, { params: { user_type: req.query.user_type }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUserFromCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users/${req.params.userId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserFromCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users/${req.params.userId}`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addCourseMedia = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourseMedia = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseMedia = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/${req.params.mediaId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getModuleMedia = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/module/${req.params.moduleId}/`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCourseMedia = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/${req.params.mediaId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addCourseRating = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/ratings`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCourseRatings = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/ratings`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/category/${req.params.categoryId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllCategories = async (_req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/category/`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCourseModule = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const newModule = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/module/`, req.body, { headers: { apikey: courses.apikey } });
    const oldCourse = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: courses.apikey } });
    const oldModules = oldCourse.data.modules;
    oldModules.push(newModule.data.id);
    await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { modules: oldModules }, { headers: { apikey: courses.apikey } });
    return res.status(200).json(newModule.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseModule = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/module/${req.params.moduleId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCourseModule = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/module/${req.params.moduleId}`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCourseModule = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/module/${req.params.moduleId}`, req.body, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCourseMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.name}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/metrics`, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSolvedExams = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.name}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/course/${req.params.id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state }, headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
