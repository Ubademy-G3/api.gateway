const axios = require("axios");

exports.verifyToken = (req, res, next) => {
  try {
    // console.log(req.headers);
    const token = req.headers.authorization;
    axios.get(`${process.env.AUTH_SERVICE_URL}/authentication`, { params: { token } })
      .then((response) => {
        // console.log(response);
        res.status(200).json(response);
        next();
      })
      .catch((err) => {
        // console.log(err);
        res.status(401).json({ error: new Error(`Unauthorized ${err}`) });
      });
  } catch (e) {
    // console.log(e);
    res.status(401).json({
      error: new Error("Authentication failed"),
    });
  }
};
