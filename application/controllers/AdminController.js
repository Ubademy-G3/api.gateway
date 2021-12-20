const axios = require("axios");
const logger = require("../logger")("AdminController.js");

exports.createMicroservice = async (req, res) => {
  logger.info("Create new microservice");
  logger.debug(`Name of the new microservice: ${req.params.name}`);
  axios.post(`${process.env.ADMIN_SERVICE_URL}/microservices/`, req.body, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
        return res.status(err.response.status).json(err.response.data);
      }
      logger.error(`Critical error when creating microservice ${req.body.name}`);
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getMicroservice = async (req, res) => {
  logger.info("Get microservice");
  logger.debug(`Name of the searched service: ${req.params.name}`);
  axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/${req.params.id}`, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
        return res.status(err.response.status).json(err.response.data);
      }
      logger.error(`Critical error when getting microservice ${req.body.name}`);
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.updateMicroservice = async (req, res) => {
  logger.info("Update microservice");
  logger.debug(`Name of the microservice to update: ${req.params.name}`);
  axios.patch(`${process.env.ADMIN_SERVICE_URL}/microservices/${req.params.id}`, req.body, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
        return res.status(err.response.status).json(err.response.data);
      }
      logger.error(`Critical error when updating microservice ${req.body.name}`);
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.deleteMicroservice = async (req, res) => {
  logger.info("Delete microservice");
  logger.debug(`Name of the microservice to delete: ${req.params.name}`);
  axios.delete(`${process.env.ADMIN_SERVICE_URL}/microservices/${req.params.id}`, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
        return res.status(err.response.status).json(err.response.data);
      }
      logger.error(`Critical error when deleting microservice ${req.body.name}`);
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};

exports.getAllMicroservices = async (req, res) => {
  logger.info("Get all microservices");
  axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/`, { headers: { apikey: process.env.ADMIN_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
        return res.status(err.response.status).json(err.response.data);
      }
      logger.error(`Critical error when deleting microservice ${req.body.name}`);
      return res.status(500).json({ message: "Internal server error" });
    });
  return null;
};
