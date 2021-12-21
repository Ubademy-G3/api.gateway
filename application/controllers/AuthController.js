const axios = require("axios");
const serializer = require("../serializers/LoggedUserSerializer");
const logger = require("../logger")("AuthController.js");

const FREE_SUBSCRIPTION = "free";

const subscriptionHasExpired = (user) => Date.parse(user.subscriptionExpirationDate) < Date.now();

const subscriptionAboutToExpire = (user) => {
  const diff = Math.floor((Date.parse(user.subscriptionExpirationDate) - Date.now()));
  const diffInDays = diff / (1000 * 60 * 60 * 24);
  return diffInDays < 5;
};

exports.signup = async (req, res) => {
  try {
    logger.info("SignUp user");
    logger.debug(`Email of the new user: ${req.body.email}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=auth&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const auth = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (auth.state !== "active") {
      logger.error(`${auth.name} microservice is ${auth.state}`);
      return res.status(400).json({ message: `${auth.name} microservice is ${auth.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const signup = await axios.post(`${process.env.AUTH_SERVICE_URL}/authorization`, req.body);
    try {
      await axios.post(`${process.env.USERS_SERVICE_URL}/users`, req.body, { headers: { Authorization: users.apikey } });
    } catch (err) {
      logger.info("Deleted signup when user creation failed");
      await axios.delete(`${process.env.AUTH_SERVICE_URL}/authorization/users/${signup.data.id}`);
      if (err.response && err.response.status && err.response.data) {
        logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
        return res.status(err.response.status).json(err.response.data);
      }
    }
    logger.info("User created successfully");
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when creating user ${req.body.email}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    logger.info("Login user");
    logger.debug(`Email of the user who is logging in: ${req.body.email}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=auth&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const auth = result.data.microservices[0];
    const users = result.data.microservices[1];
    if (auth.state !== "active") {
      logger.error(`${auth.name} microservice is ${auth.state}`);
      return res.status(400).json({ message: `${auth.name} microservice is ${auth.state}` });
    }
    if (users.state !== "active") {
      logger.error(`${users.name} microservice is ${users.state}`);
      return res.status(400).json({ message: `${users.name} microservice is ${users.state}` });
    }
    const authUser = await axios.post(`${process.env.AUTH_SERVICE_URL}/authentication`, req.body);
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.body.email }, headers: { Authorization: users.apikey } });
    const loggedUser = Object.assign(authUser.data, user.data[0]);
    if (subscriptionHasExpired(loggedUser) && loggedUser.subscription !== FREE_SUBSCRIPTION) {
      loggedUser.subscriptionState = "expired";
      logger.warn(`Subscription expired for user ${loggedUser.id}`);
      await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${loggedUser.id}`, { params: { subscription: FREE_SUBSCRIPTION } }, { headers: { Authorization: users.apikey } });
    } else if (subscriptionAboutToExpire(loggedUser)
      && loggedUser.subscription !== FREE_SUBSCRIPTION) {
      loggedUser.subscriptionState = "about_to_expire";
    } else {
      loggedUser.subscriptionState = "active";
    }
    logger.info("User logged in successfully");
    return res.status(200).json(serializer(loggedUser));
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when logging in user ${req.body.email}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    logger.info("Reset password");
    logger.debug(`Email of user who wants to reset password: ${req.body.email}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/auth`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const auth = result.data;
    if (auth.state !== "active") {
      logger.error(`${auth.name} microservice is ${auth.state}`);
      return res.status(400).json({ message: `${auth.name} microservice is ${auth.state}` });
    }
    const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/authentication/password`, req.body);
    logger.info("Email sent successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting microservice ${req.body.name}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};
