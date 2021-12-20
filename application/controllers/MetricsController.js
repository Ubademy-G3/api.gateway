const axios = require("axios");
const logger = require("../logger")("MetricsController.js");

exports.getCourseMetricsByCourseID = async (req, res) => {
  try {
    logger.info("Get course metrics by course id");
    logger.debug(`Get all metrics from the course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const metrics = result.data.microservices[1];
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (metrics.state !== "active") {
      logger.error(`${metrics.name} microservice is ${metrics.state}`);
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/${req.params.id}`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all metrics from course ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllCourseMetrics = async (req, res) => {
  try {
    logger.info("Get metrics from all the courses");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const metrics = result.data.microservices[1];
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (metrics.state !== "active") {
      logger.error(`${metrics.name} microservice is ${metrics.state}`);
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting metrics of all the courses");
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserMetricsByUserID = async (req, res) => {
  try {
    logger.info("Get metrics from a user");
    logger.debug(`Get metrics from the user ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=metrics&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (metrics.state !== "active") {
      logger.error(`${metrics.name} microservice is ${metrics.state}`);
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/${req.params.id}`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting metrics from user ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUserMetrics = async (req, res) => {
  try {
    logger.info("Get metrics of all the users");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=metrics&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (metrics.state !== "active") {
      logger.error(`${metrics.name} microservice is ${metrics.state}`);
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting metrics from user ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPaymentMetrics = async (req, res) => {
  try {
    logger.info("Get metrics of all payments");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=metrics&name_list=payments`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data.microservices[0];
    const payments = result.data.microservices[1];
    if (metrics.state !== "active") {
      logger.error(`${metrics.name} microservice is ${metrics.state}`);
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    if (payments.state !== "active") {
      logger.error(`${payments.name} microservice is ${payments.state}`);
      return res.status(400).json({ message: `${payments.name} microservice is ${payments.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/payments/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting metrics from all payments");
    return res.status(500).json({ message: "Internal server error" });
  }
};
