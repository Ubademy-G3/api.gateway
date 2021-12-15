const axios = require("axios");

exports.getAllDeposits = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.PAYMENTS_SERVICE_URL}/deposit`, { headers: { authorization: process.env.PAYMENTS_APIKEY } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
