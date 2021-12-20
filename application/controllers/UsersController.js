const axios = require("axios");
const logger = require("../logger")("UsersController.js");

const serializeQuery = (params, prefix) => {
  const query = params.map(((value) => `${prefix}${value}`));
  return query.join("&");
};

const queryUrl = (url, list, prefix) => {
  const params = serializeQuery(list, prefix);
  let result = url;
  if (params.length > 0) {
    result = result.concat(`?${params}`);
  }
  return result;
};

exports.getUserById = async (req, res) => {
  try {
    logger.info("Get user by id");
    logger.debug(`Get user with id ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { Authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting user with id ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    logger.info("Update user");
    logger.debug(`Update user with id ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, req.body, { headers: { Authorization: users.apikey } });
    logger.info("User updated successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating user with id ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    logger.info("Get courses from a user");
    logger.debug(`Get courses from the user ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/courses`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data;
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    const response = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/user/${req.params.id}`, { params: { user_type: req.query.user_type, aprobal_state: req.query.aprobal_state }, headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting courses from user with id ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFavoriteCourses = async (req, res) => {
  try {
    logger.info("Get favorite courses from a user");
    logger.debug(`Get favorite courses from the user ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (courses.state !== "active") {
      logger.error(`${courses.name} microservice is ${courses.state}`);
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { Authorization: users.apikey } });
    const url = queryUrl(`${process.env.COURSES_SERVICE_URL}/courses/list/`, user.data.favoriteCourses, "id=");
    const response = await axios.get(url, { headers: { apikey: courses.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting favorite courses from user with id ${req.params.id}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSolvedExams = async (req, res) => {
  try {
    logger.info("Get solved exams from a user");
    logger.debug(`Get solved exams from the user ${req.params.id} with user_type ${req.query.user_type}`);
    if (!req.query.user_type) {
      logger.warn("Bad request: Missing 'user_type' field");
      return res.status(400).json({ message: "Missing 'user_type' field" });
    }
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/${req.query.user_type}/${req.params.id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state }, headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting solved exams from user with id ${req.params.id} and user_type ${req.query.user_type}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSolvedExamsByCourse = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/solutions/user/${req.params.id}/course/${req.params.course_id}`, { params: { graded: req.query.graded, approval_state: req.query.approval_state }, headers: { apikey: exams.apikey } });
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
    logger.info("Get exams from a user");
    logger.debug(`Get exams from user ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/creator/${req.params.id}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting exams from user with id ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    logger.info("Get all users");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const users = result.data;
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.query.email, idList: req.query.idList }, headers: { authorization: users.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting all users");
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createWallet = async (req, res) => {
  try {
    logger.info("Create wallet for a user");
    logger.debug(`Create wallet for the user ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=payments&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const payments = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (payments.state !== "active") {
      logger.error(`${payments.name} microservice is ${payments.state}`);
      return res.status(400).json({ message: `${payments.name} microservice is ${payments.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.post(`${process.env.PAYMENTS_SERVICE_URL}/wallet`, {}, { headers: { authorization: payments.apikey } });
    const wallet = response.data;
    await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { wallet_id: wallet.id }, { headers: { authorization: users.apikey } });
    logger.info("Wallet created successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when creating wallet for the user ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserWallet = async (req, res) => {
  try {
    logger.info("Get wallet from a user");
    logger.debug(`Get waller from the user ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=payments&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const payments = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (payments.state !== "active") {
      logger.error(`${payments.name} microservice is ${payments.state}`);
      return res.status(400).json({ message: `${payments.name} microservice is ${payments.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { authorization: users.apikey } });
    const { walletId } = response.data;
    const wallet = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/wallet/${walletId}`, { headers: { authorization: payments.apikey } });
    return res.status(response.status).json(wallet.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting wallet for the user ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.makeDeposit = async (req, res) => {
  try {
    logger.info("Makes a new deposit");
    logger.debug(`The user ${req.params.id} makes a new deposit with amount ${req.body.amount}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=payments&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const payments = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (payments.state !== "active") {
      logger.error(`${payments.name} microservice is ${payments.state}`);
      return res.status(400).json({ message: `${payments.name} microservice is ${payments.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const response = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.params.id}`, { headers: { authorization: users.apikey } });
    const { walletId } = response.data;
    const wallet = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/wallet/${walletId}`, { headers: { authorization: payments.apikey } });
    const { address } = wallet.data;
    const deposit = await axios.post(`${process.env.PAYMENTS_SERVICE_URL}/deposit`, { sender_address: address, amount_sent: req.body.amount }, { headers: { authorization: payments.apikey } });
    logger.info("Deposit generated successfully");
    return res.status(response.status).json(deposit.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when generating deposit for the user ${req.params.id} with amount ${req.body.amount}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
