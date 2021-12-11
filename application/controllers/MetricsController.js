const axios = require("axios");

exports.getCourseMetricsByCourseID = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const metrics = result.data.microservices[1];
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (metrics.state !== "active") {
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/${req.params.id}`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllCourseMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const metrics = result.data.microservices[1];
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (metrics.state !== "active") {
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserMetricsByUserID = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=metrics&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (metrics.state !== "active") {
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    if (users.state !== "active") {
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/${req.params.id}`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUserMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=metrics&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (metrics.state !== "active") {
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    if (users.state !== "active") {
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllPaymentMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=metrics&name_list=payments`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data.microservices[0];
    const payments = result.data.microservices[1];
    if (metrics.state !== "active") {
      return res.status(400).json({ message: `${metrics.name} microservice is ${metrics.state}` });
    }
    if (payments.state !== "active") {
      return res.status(400).json({ message: `${payments.name} microservice is ${payments.state}` });
    }
    const response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/payments/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
