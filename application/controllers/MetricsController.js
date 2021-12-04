const axios = require("axios");

exports.getCourseMetricsByCourseID= async (req, res) => {
  axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/${req.params.id}`, { headers: { apikey: process.env.METRICS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getAllCourseMetrics = async (req, res) => {
  axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/courses/`, { headers: { apikey: process.env.METRICS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getUserMetricsByUserID= async (req, res) => {
  axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/${req.params.id}`, { headers: { apikey: process.env.METRICS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getAllUserMetrics = async (req, res) => {
  axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/users/`, { headers: { apikey: process.env.METRICS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getAllPaymentMetrics = async (req, res) => {
  axios.get(`${process.env.METRICS_SERVICE_URL}/metrics/payments/`, { headers: { apikey: process.env.METRICS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};
