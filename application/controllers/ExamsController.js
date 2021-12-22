/* istanbul ignore file */
const axios = require("axios");
const logger = require("../logger")("ExamsController.js");

exports.createExamTemplate = async (req, res) => {
  try {
    logger.info("Create new exam template");
    logger.debug(`Create exam template "${req.body.name}" in course ${req.body.course_id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/`, req.body, { headers: { apikey: exams.apikey } });
    logger.info("New exam template created successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when creating exam template "${req.body.name}"`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExamTemplate = async (req, res) => {
  try {
    logger.info("Get exam template by id");
    logger.debug(`Get exam template with id ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting exam template ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateExamTemplate = async (req, res) => {
  try {
    logger.info("Update exam template");
    logger.debug(`Update exam template with id ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/?name_list=courses&name_list=exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const courses = result.data.microservices[0];
    const exams = result.data.microservices[1];
    if (courses.state !== "active") {
      return res.status(400).json({ message: `${courses.name} microservice is ${courses.state}` });
    }
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    if (req.body.state === "active") {
      const previousExam = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: exams.apikey } });
      if (previousExam.data.state === "draft") {
        const course = await axios.get(`${process.env.COURSES_SERVICE_URL}/courses/${previousExam.data.course_id}`, { headers: { apikey: courses.apikey } });
        const activeExams = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/course/${previousExam.data.course_id}`, { params: { state: "active" }, headers: { apikey: exams.apikey } });
        const inactiveExams = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/course/${previousExam.data.course_id}`, { params: { state: "inactive" }, headers: { apikey: exams.apikey } });
        if (activeExams.data.amount + inactiveExams.data.amount >= course.data.total_exams) {
          return res.status(400).json({ message: "You reached the amount of active exams for this course" });
        }
      }
    }
    const response = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, req.body, { headers: { apikey: exams.apikey } });
    logger.info("Exam updated successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating exam template ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteExamTemplate = async (req, res) => {
  try {
    logger.info("Delete exam template");
    logger.debug(`Delete exam template with id ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, { headers: { apikey: exams.apikey } });
    logger.info("Exam deleted successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when deleting exam template ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllExamsByCourseId = async (req, res) => {
  try {
    logger.info("Get all exams by course id");
    logger.debug(`Get exams from course ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/course/${req.params.id}`, { params: { state: req.query.state }, headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all exams from course ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addQuestionToExam = async (req, res) => {
  try {
    logger.info("Add question to exam");
    logger.debug(`Add question to the exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/`, req.body, { headers: { apikey: exams.apikey } });
    const questionType = {};
    if (response.data.question_type === "multiple_choice") {
      questionType.has_multiple_choice = true;
      logger.debug("The question is multiple choice");
    } else if (response.data.question_type === "media") {
      questionType.has_media = true;
      logger.debug("The question has media content");
    } else {
      questionType.has_written = true;
      logger.debug("The question is written");
    }
    await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, questionType, { headers: { apikey: exams.apikey } });
    logger.info("Question added successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when adding question to exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editExamQuestion = async (req, res) => {
  try {
    logger.info("Edit exam question");
    logger.debug(`Edit question ${req.params.questionId} from exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const oldQuestion = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: exams.apikey } });
    const newQuestion = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, req.body, { headers: { apikey: exams.apikey } });
    if (oldQuestion.data.question_type !== newQuestion.data.question_type) {
      const questionType = {};
      if (newQuestion.data.question_type === "multiple_choice") {
        questionType.has_multiple_choice = true;
        logger.debug("The question is multiple choice");
      } else if (newQuestion.data.question_type === "media") {
        questionType.has_media = true;
        logger.debug("The question has media content");
      } else {
        questionType.has_written = true;
        logger.debug("The question is written");
      }
      await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}`, questionType, { headers: { apikey: exams.apikey } });
    }
    logger.info("Question edited successfully");
    return res.status(newQuestion.status).json(newQuestion.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when editing question ${req.params.questionId} from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeQuestionFromExam = async (req, res) => {
  try {
    logger.info("Remove question from exam");
    logger.debug(`Remove question ${req.params.questionId} from exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.delete(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: exams.apikey } });
    logger.info("Question removed successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when removing question ${req.params.questionId} from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllQuestionsFromExam = async (req, res) => {
  try {
    logger.info("Get all questions from exam");
    logger.debug(`Get all questions from the exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all questions from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExamQuestion = async (req, res) => {
  try {
    logger.info("Get exam question by id");
    logger.debug(`Get question ${req.params.questionId} from exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/questions/${req.params.questionId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting question ${req.params.questionId} from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllExamSolutions = async (req, res) => {
  try {
    logger.info("Get all the exam solutions");
    logger.debug(`Get all solutions of the exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all solutions of exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addExamSolutions = async (req, res) => {
  try {
    logger.info("Add solutions to a exam");
    logger.debug(`Add solution to the exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/`, req.body, { headers: { apikey: exams.apikey } });
    logger.info("Solution added successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when adding new solution to the exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExamSolution = async (req, res) => {
  try {
    logger.info("Get solution from an exam");
    logger.debug(`Get solution ${req.params.solutionId} from exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting solution ${req.params.solutionId} from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateExamSolution = async (req, res) => {
  try {
    logger.info("Update an exam solution");
    logger.debug(`Update the solution ${req.params.solutionId} from the exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}`, req.body, { headers: { apikey: exams.apikey } });
    logger.info("Solution updated successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating solution ${req.params.solutionId} from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllExamAnswers = async (req, res) => {
  try {
    logger.info("Get all answers from an exam");
    logger.debug(`Get all answers from the exam ${req.params.id}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting all answers from exam ${req.params.id}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addExamAnswer = async (req, res) => {
  try {
    logger.info("Add answer to an exam");
    logger.debug(`Add answer "${req.body.answer}" to the exam ${req.params.id} with solution ${req.params.solutionId}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.post(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers`, req.body, { headers: { apikey: exams.apikey } });
    logger.info("Answer added successfully");
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when adding new answer "${req.body.answer}" to the exam ${req.params.id} with solution ${req.params.solutionId}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getExamAnswer = async (req, res) => {
  try {
    logger.info("Get answer from an exam");
    logger.debug(`Get answer ${req.params.answerId} from exam ${req.params.id} with solution ${req.params.solutionId}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.get(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers/${req.params.answerId}`, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when getting answer "${req.body.answer}" from the exam ${req.params.id} with solution ${req.params.solutionId}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateExamAnswer = async (req, res) => {
  try {
    logger.info("Update answer from an exam");
    logger.debug(`Update answer ${req.params.answerId} from exam ${req.params.id} with solution ${req.params.solutionId}`);
    const result = await axios.get(`${process.env.ADMIN_SERVICE_URL}/microservices/name/exams`, { headers: { apikey: process.env.ADMIN_APIKEY } });
    const exams = result.data;
    if (exams.state !== "active") {
      logger.error(`${exams.name} microservice is ${exams.state}`);
      return res.status(400).json({ message: `${exams.name} microservice is ${exams.state}` });
    }
    const response = await axios.patch(`${process.env.EXAMS_SERVICE_URL}/exams/${req.params.id}/solutions/${req.params.solutionId}/answers/${req.params.answerId}`, req.body, { headers: { apikey: exams.apikey } });
    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response && err.response.status && err.response.data) {
      logger.warn(`Error ${err.response.status}: ${err.response.data.message}`);
      return res.status(err.response.status).json(err.response.data);
    }
    logger.error(`Critical error when updating answer "${req.body.answer}" from the exam ${req.params.id} with solution ${req.params.solutionId}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
