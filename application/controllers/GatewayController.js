const axios = require("axios");
const serializer = require("../serializers/LoggedUserSerializer");

exports.signup = async (req, res) => {
  try {
    await axios.post(`${process.env.AUTH_SERVICE_URL}/authorization`, req.body);
    await axios.post(`${process.env.USERS_SERVICE_URL}/users`, req.body, { headers: { Authorization: process.env.USERS_APIKEY } });
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const authUser = await axios.post(`${process.env.AUTH_SERVICE_URL}/authentication`, req.body);
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.body.email }, headers: { Authorization: process.env.USERS_APIKEY } });
    const loggedUser = Object.assign(authUser.data, user.data[0]);
    return res.status(200).json(serializer(loggedUser));
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  axios.post(`${process.env.AUTH_SERVICE_URL}/authentication/password`, req.body)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        res.status(err.response.status).json(err.response.data);
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    });
};

exports.getUserById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
