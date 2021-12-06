const axios = require("axios");

exports.getUserById = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state != 'active'){
      return res.status(400).json({message: users.name + " microservice is " + users.state});
    }
    response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { Authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.updateUserInfo = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state != 'active'){
      return res.status(400).json({message: users.name + " microservice is " + users.state});
    }
    response = await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, req.body, { headers: { Authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getCourses = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state != 'active'){
      return res.status(400).json({message: users.name + " microservice is " + users.state});
    }
    response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/user/${req.params.id}`, { params: { user_type: req.query.user_type, aprobal_state: req.query.aprobal_state }, headers: { apikey: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getSolvedExams = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/${req.query.user_type}/${req.params.id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state}, headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getExams = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/creator/${req.params.id}`, { headers: { apikey:  exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
}

exports.getAllUsers = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state != 'active'){
      return res.status(400).json({message: users.name + " microservice is " + users.state});
    }
    response = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.query.email }, headers: { authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
}
