const axios = require("axios");

exports.getUserById = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state !== "active") {
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { Authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state !== "active") {
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, req.body, { headers: { Authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/user/${req.params.id}`, { params: { user_type: req.query.user_type, aprobal_state: req.query.aprobal_state }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSolvedExams = async (req, res) => {
  try {
    if (!req.query.user_type) {
      return res.status(400).json({ message: "Missing 'user_type' field" });
    }
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/${req.query.user_type}/${req.params.id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state }, headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExams = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/creator/${req.params.id}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state !== "active") {
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.query.email }, headers: { authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createWallet = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.PAYMENTS_SERVICE_URL}/wallet`, {}, { headers: { authorization: process.env.PAYMENTS_APIKEY } });
    const wallet = response.data;
    await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { wallet_id: wallet.id }, { headers: { authorization: process.env.USERS_APIKEY } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserWallet = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { authorization: process.env.USERS_APIKEY } });
    const { walletId } = response.data;
    const wallet = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/wallet/${walletId}`, { headers: { authorization: process.env.PAYMENTS_APIKEY } });
    return res.status(response.status).json(wallet.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.makeDeposit = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { authorization: process.env.USERS_APIKEY } });
    const { walletId } = response.data;
    const wallet = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/wallet/${walletId}`, { headers: { authorization: process.env.PAYMENTS_APIKEY } });
    const { address } = wallet.data;
    const deposit = await axios.post(`${process.env.PAYMENTS_SERVICE_URL}/deposit`, { sender_address: address, amount_sent: req.body.amount }, { headers: { authorization: process.env.PAYMENTS_APIKEY } });
    return res.status(response.status).json(deposit.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
