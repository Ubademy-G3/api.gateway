const axios = require("axios");

exports.getUserById = async (req, res) => {
  axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { Authorization: process.env.USERS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.updateUserInfo = async (req, res) => {
  axios.patch(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, req.body, { headers: { Authorization: process.env.USERS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getCourses = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/user/${req.params.id}`, { params: { user_type: req.query.user_type, aprobal_state: req.query.aprobal_state }, headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};
