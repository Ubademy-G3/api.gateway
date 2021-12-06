const axios = require("axios");
const serializer = require("../serializers/LoggedUserSerializer");

const FREE_SUBSCRIPTION = "free";

const subscriptionHasExpired = (user) => Date.parse(user.subscriptionExpirationDate) < Date.now();

const subscriptionAboutToExpire = (user) => {
  const diff = Math.floor((Date.parse(user.subscriptionExpirationDate) - Date.now()));
  const diffInDays = diff / (1000 * 60 * 60 * 24);
  return diffInDays < 5;
};

exports.signup = async (req, res) => {
  try {
    console.log('llegue al signup');
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=auth&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    console.log(result);
    const auth = result['data']['microservices'][0];
    const users = result['data']['microservices'][1];
    console.log(auth);
    console.log(users);
    if (auth['state'] != 'active'){
      return res.status(400).json({message: auth['name'] + " microservice is " + auth['state']});
    }
    if (users['state'] != 'active'){
      return res.status(400).json({message: users['name'] + " microservice is " + users['state']});
    }
    await axios.post(`${process.env.AUTH_SERVICE_URL}/authorization`, req.body);
    await axios.post(`${process.env.USERS_SERVICE_URL}/users`, req.body, { headers: { Authorization: users['apikey'] } });
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
    console.log('llegue al login');
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=auth&name_list=users`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    console.log(result);
    const auth = result['data']['microservices'][0];
    const users = result['data']['microservices'][1];
    console.log(auth);
    console.log(users);
    if (auth['state'] != 'active'){
      return res.status(400).json({message: auth['name'] + " microservice is " + auth['state']});
    }
    if (users['state'] != 'active'){
      return res.status(400).json({message: users['name'] + " microservice is " + users['state']});
    }
    const authUser = await axios.post(`${process.env.AUTH_SERVICE_URL}/authentication`, req.body);
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users`, { params: { email: req.body.email }, headers: { Authorization: users['apikey'] } });
    const loggedUser = Object.assign(authUser.data, user.data[0]);
    if (subscriptionHasExpired(loggedUser) && loggedUser.subscription !== FREE_SUBSCRIPTION) {
      loggedUser.subscriptionState = "expired";
      await axios.patch(`${process.env.USERS_SERVICE_URL}/users/${loggedUser.id}`, { params: { subscription: FREE_SUBSCRIPTION } }, { headers: { Authorization: users['apikey'] } });
    } else if (subscriptionAboutToExpire(loggedUser)
      && loggedUser.subscription !== FREE_SUBSCRIPTION) {
      loggedUser.subscriptionState = "about_to_expire";
    } else {
      loggedUser.subscriptionState = "active";
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
  try {
    console.log('llegue al resetPassword');
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/auth`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    console.log(result);
    const auth = result['data'];
    console.log(auth);
    if (auth['state'] != 'active'){
      return res.status(400).json({message: auth['name'] + " microservice is " + auth['state']});
    }
    response = await axios.post(`${process.env.AUTH_SERVICE_URL}/authentication/password`, req.body);
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
