const axios = require("axios");
const logger = require("../logger")("AuthMiddleware.js");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    axios.get(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token } })
      .then((response) => {
        if (response.data.message === "Invalid token") {
          logger.warn(`Invalid token: ${req.headers.authorization}`);
          res.status(401).json({ message: "Unauthorized" });
        } else {
          next();
        }
      })
      .catch((err) => {
        logger.error(`Unauthorized: ${err}`);
        res.status(401).json({ message: `Unauthorized ${err}` });
      });
  } catch (e) {
    logger.warn("Authentication failed");
    res.status(401).json({
      message: "Authentication failed",
    });
  }
};
