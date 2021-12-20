const axios = require("axios");
const logger = require("../logger")("PaymentsController.js");

exports.getAllDeposits = async (req, res) => {
  try {
    logger.info("Get all deposits");
    const response = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/deposit`, { headers: { authorization: process.env.PAYMENTS_APIKEY } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error("Critical error when getting all deposits");
    return res.status(500).json({ message: "Internal server error" });
  }
};
