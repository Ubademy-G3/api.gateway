const axios = require("axios");

exports.getUserById = async (req, res) => {
  axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { Authorization: process.env.USERS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
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
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getSolvedExams = async (req, res) => {
  if (!req.query.user_type) {
    return res.status(400).json({ message: "Missing 'user_type' field" });
  }
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/${req.query.user_type}/${req.params.id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state}, headers: { apikey: process.env.EXAMS_APIKEY } })
  .then((response) => res.status(response.status).json(response.data))
  .catch((err) => {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  });

  return null;
};

exports.getExams = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/creator/${req.params.id}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  
  return null;
}

exports.getAllUsers = async (req, res) => {
  axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.query.email }, headers: { apikey: process.env.USERS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  
  return null;
}