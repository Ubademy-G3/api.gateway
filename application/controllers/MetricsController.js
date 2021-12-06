const axios = require("axios");

exports.getCourseMetricsByCourseID= async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data;
    if (metrics.state != 'active'){
      return res.status(400).json({message: metrics.name + " microservice is " + metrics.state});
    }
    response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/${req.params.id}`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllCourseMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data;
    if (metrics.state != 'active'){
      return res.status(400).json({message: metrics.name + " microservice is " + metrics.state});
    }
    response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getUserMetricsByUserID= async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data;
    if (metrics.state != 'active'){
      return res.status(400).json({message: metrics.name + " microservice is " + metrics.state});
    }
    response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/${req.params.id}`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllUserMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data;
    if (metrics.state != 'active'){
      return res.status(400).json({message: metrics.name + " microservice is " + metrics.state});
    }
    response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllPaymentMetrics = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/metrics`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const metrics = result.data;
    if (metrics.state != 'active'){
      return res.status(400).json({message: metrics.name + " microservice is " + metrics.state});
    }
    response = await axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/payments/`, { headers: { apikey: metrics.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};
