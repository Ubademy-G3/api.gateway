const axios = require("axios");

const FREE_USER = "free";
const FREE_COURSE = "free";
const GOLD_USER = "gold";
const PREMIUM_COURSE = "premium";

const USER_TYPE_INSTRUCTOR = "instructor";

const userCantSubscribeToCourse = (userSubscription, courseSubscription) => (
  (userSubscription === GOLD_USER && courseSubscription === PREMIUM_COURSE)
  || (userSubscription === FREE_USER && courseSubscription !== FREE_COURSE)
);

exports.createCourse = async (req, res) => {
  try {
    // const user = req.body.user_id;
    // delete req.body.user_id;
    // console.log(req.body)
    const newCourse = await axios.post(`${process.env.COURSES_SERVICE_URL}/courses`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    // console.log(newCourse.data)
    const newUserCourse = {
      user_id: req.body.user_id,
      user_type: USER_TYPE_INSTRUCTOR,
      progress: 0,
      aprobal_state: false
    }
    // await new Promise(resolve => setTimeout(resolve, 10000));
    // const a = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${newCourse.data.id}`, { headers: { apikey: process.env.COURSES_APIKEY } })
    // console.log(newUserCourse)
    // console.log(a)
    await axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${newCourse.data.id}/users/`, newUserCourse, { headers: { apikey: process.env.COURSES_APIKEY } })
    return  res.status(200).json(newCourse.data)
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    console.log(err)
    return res.status(500).json({ error: "Internal server error" });
  }
  
  return null;
};

exports.updateCourse = async (req, res) => {
  axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getCourse = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllCourses = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses`, { params: { category: req.query.category, subscription_type: req.query.subscription_type }, headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.addUserToCourse = async (req, res) => {
  try {
    const user = await axios.get(`${process.env.USERS_SERVICE_URL}/users/${req.body.user_id}`, { headers: { Authorization: process.env.USERS_APIKEY } });
    const course = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}`, { headers: { apikey: process.env.COURSES_APIKEY } });
    if (userCantSubscribeToCourse(user.data.subscription, course.data.subscription_type)) {
      return res.status(403).json({ message: `Can't subscribe user with subscription type ${user.data.subscription} to ${course.data.subscription_type} course` });
    }
  } catch (err) {
    return res.status(500).json({ message: `Internal server error: ${err}` });
  }

  axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getUsersFromCourse = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, { params: { user_type: req.query.user_type }, headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.deleteUserFromCourse = async (req, res) => {
  axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users/${req.params.userId}`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.updateUserFromCourse = async (req, res) => {
  axios.patch(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users/${req.params.userId}`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.addCourseMedia = async (req, res) => {
  axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllCourseMedia = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getCourseMedia = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/${req.params.mediaId}`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.deleteCourseMedia = async (req, res) => {
  axios.delete(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/media/${req.params.mediaId}`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.addCourseRating = async (req, res) => {
  axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/ratings`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllCourseRatings = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/ratings`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getCategoryById = async (req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/category/${req.params.categoryId}`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getAllCategories = async (_req, res) => {
  axios.get(`${process.env.COURSES_SERVICE_URL}/courses/category/`, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};
