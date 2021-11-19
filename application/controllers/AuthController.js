const axios = require("axios");
const serializer = require("../serializers/LoggedUserSerializer");

const subscriptionHasExpired = (user) => {
  return Date.parse(user.subscriptionExpirationDate) < Date.now();
}

const subscriptionAboutToExpire = (user) => {
  return Math.floor((Date.parse(user.subscriptionExpirationDate) - Date.now()) / (1000*60*60*24)) < 5;
}

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
    if (subscriptionHasExpired(loggedUser) && loggedUser.subscription !== 'Free') {
      loggedUser.subscriptionState = 'expired';
      await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${loggedUser.id}`, { subscription: 'Free' }, { headers: { Authorization: process.env.USERS_APIKEY }})
    } else if (subscriptionAboutToExpire(loggedUser) && loggedUser.subscription !== 'Free') {
      loggedUser.subscriptionState = 'about_to_expire';
    } else {
      loggedUser.subscriptionState = 'active';
    }
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
