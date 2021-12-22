const axios = require("axios");
const logger = require("../logger")("PaymentsController.js");

exports.getAllDeposits = async (req, res) => {
  try {
    logger.info("Get all deposits");
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/payments`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const payments = result.data;
    if (payments.state !== "active") {
      logger.error(`${payments.name} microservice is ${payments.state}`);
      return res.status(400).json({ message: `${payments.name} microservice is ${payments.state}` });
    }
    console.log(payments);
    console.log(payments.apikey);
    logger.info(payments);
    const response = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/deposit`, { headers: { authorization: payments.apikey } });

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
