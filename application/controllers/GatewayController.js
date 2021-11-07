const axios = require("axios");

exports.signup = async (req, res) => {
  // falta hacer el llamado al MS de users para hacer un POST con la info personal
  axios.post(`${process.env.AUTH_SERVICE_URL}/authorization`, req.body)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (err.response.status && err.response.data) {
        res.status(err.response.status).json(err.response.data);
      }
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.login = async (req, res) => {
  // falta hacer un GET al MS de users para appendearle a la respuesta la info basica del usuario
  axios.post(`${process.env.AUTH_SERVICE_URL}/authentication`, req.body)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (err.response.status && err.response.data) {
        res.status(err.response.status).json(err.response.data);
      }
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.resetPassword = async (req, res) => {
  axios.post(`${process.env.AUTH_SERVICE_URL}/authentication/password`, req.body)
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((err) => {
      if (err.response.status && err.response.data) {
        res.status(err.response.status).json(err.response.data);
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    });
};
