const axios = require("axios");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    axios.get(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token } })
      .then((response) => {
        if (response.data.message === "Invalid token") {
          res.status(401).json({ error: "Unauthorized" });
        }
        next();
      })
      .catch((err) => {
        res.status(401).json({ error: `Unauthorized ${err}` });
      });
  } catch (e) {
    res.status(401).json({
      error: "Authentication failed",
    });
  }
};
