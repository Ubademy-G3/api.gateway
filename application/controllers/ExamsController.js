const axios = require("axios");

exports.createExamTemplate = async (req, res) => {
  axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
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
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
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
  axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
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
  axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllExamsByCourseId = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/course/${req.params.id}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.addQuestionToExam = async (req, res) => {
  axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.editExamQuestion = async (req, res) => {
  axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.removeQuestionFromExam = async (req, res) => {
  axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllQuestionsFromExam = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getExamQuestion = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllExamSolutions = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.addExamSolutions = async (req, res) => {
  axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getExamSolution = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getAllExamAnswers = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.addExamAnswer = async (req, res) => {
  axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers`, req.body, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};

exports.getExamAnswer = async (req, res) => {
  axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers/${req.params.answerId}`, { headers: { apikey: process.env.EXAMS_APIKEY } })
    .then((response) => res.status(response.status).json(response.data))
    .catch((err) => {
      if (err.response && err.response.status && err.response.data) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(500).json({ error: "Internal server error" });
    });
  return null;
};
