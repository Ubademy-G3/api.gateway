const axios = require("axios");

exports.createExamTemplate = async (req, res) => {
    axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/templates`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
      .then((response) => res.status(response.status).json(response.data))
      .catch((err) => {
        if (err.response && err.response.status && err.response.data) {
          return res.status(err.response.status).json(err.response.data);
        }
        return res.status(500).json({ error: "Internal server error" });
      });
    return null;
  };


  exports.getExamTemplate = async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Bad request" });
    }
    axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/templates/${req.params.id}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
      .then((response) => res.status(response.status).json(response.data))
      .catch((err) => {
        if (err.response && err.response.status && err.response.data) {
          return res.status(err.response.status).json(err.response.data);
        }
        return res.status(500).json({ error: "Internal server error" });
      });
    return null;
  };

  exports.updateExamTemplate = async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Bad request" });
    }
    axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/templates/${req.params.id}`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
      .then((response) => res.status(response.status).json(response.data))
      .catch((err) => {
        if (err.response && err.response.status && err.response.data) {
          return res.status(err.response.status).json(err.response.data);
        }
        return res.status(500).json({ error: "Internal server error" });
      });
    return null;
  };  

  exports.deleteExamTemplate = async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Bad request" });
    }
    axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/templates/${req.params.id}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
      .then((response) => res.status(response.status).json(response.data))
      .catch((err) => {
        if (err.response && err.response.status && err.response.data) {
          return res.status(err.response.status).json(err.response.data);
        }
        return res.status(500).json({ error: "Internal server error" });
      });
    return null;
  };