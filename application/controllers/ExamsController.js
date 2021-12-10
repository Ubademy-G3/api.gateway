const axios = require("axios");

exports.createExamTemplate = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getExamTemplate = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.updateExamTemplate = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.deleteExamTemplate = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllExamsByCourseId = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/course/${req.params.id}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.addQuestionToExam = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    const response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/`, req.body, { headers: { apikey: exams.apikey } });
    const questionType = {};
    if (response.data.question_type === "multiple_choice") {
      questionType.has_multiple_choice = true;
    } else if (response.data.question_type === "media") {
      questionType.has_media = true;
    } else {
      questionType.has_written = true;
    }
    await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, questionType, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editExamQuestion = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    const oldQuestion = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: exams.apikey } });
    const newQuestion = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, req.body, { headers: { apikey: exams.apikey } });
    if (oldQuestion.data.question_type !== newQuestion.data.question_type) {
      const questionType = {};
      if (newQuestion.data.question_type === "multiple_choice") {
        questionType.has_multiple_choice = true;
      } else if (newQuestion.data.question_type === "media") {
        questionType.has_media = true;
      } else {
        questionType.has_written = true;
      }
      await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, questionType, { headers: { apikey: exams.apikey } });
    }
    return res.status(newQuestion.status).json(newQuestion.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeQuestionFromExam = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllQuestionsFromExam = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getExamQuestion = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllExamSolutions = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.addExamSolutions = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getExamSolution = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.updateExamSolution = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getAllExamAnswers = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.addExamAnswer = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.getExamAnswer = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers/${req.params.answerId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};

exports.updateExamAnswer = async (req, res) => {
  try {
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state != 'active'){
      return res.status(400).json({message: exams.name + " microservice is " + exams.state});
    }
    response = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers/${req.params.answerId}`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return null;
};
