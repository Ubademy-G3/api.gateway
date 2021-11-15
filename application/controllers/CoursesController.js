const axios = require("axios");

exports.createCourse = async (req, res) => {
  axios.post(`${process.env.COURSES_SERVICE_URL}/courses`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.updateCourse = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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

exports.addUserToCourse = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
  axios.post(`${process.env.COURSES_SERVICE_URL}/courses/${req.params.id}/users`, req.body, { headers: { apikey: process.env.COURSES_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getUsersFromCourse = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id || !req.params.userId) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id || !req.params.userId) {
    return res.status(400).json({ message: "Bad request" });
  }
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

exports.getCourse = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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

exports.addCourseMedia = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id || !req.params.mediaId) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id || !req.params.mediaId) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
  if (!req.params.id) {
    return res.status(400).json({ message: "Bad request" });
  }
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
