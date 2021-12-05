const axios = require("axios");

exports.createMicroservice = async (req, res) => {
  axios.post(`${process.env.ADMIN_SERVICE_URL}/microservices/`, req.body, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getMicroservice = async (req, res) => {
  axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/${req.params.id}`, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.updateMicroservice = async (req, res) => {
  axios.patch(`${process.env.ADMIN_SERVICE_URL}/microservices/${req.params.id}`, req.body, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.deleteMicroservice = async (req, res) => {
  axios.delete(`${process.env.ADMIN_SERVICE_URL}/microservices/${req.params.id}`, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getAllMicroservices = async (req, res) => {
  axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/`, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};
