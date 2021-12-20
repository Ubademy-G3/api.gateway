const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const gateway = require("./infrastructure/routes/gateway");
const AuthMiddleware = require("./application/middlewares/AuthMiddleware");

const app = express();

const options = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options));
app.use(express.json());
app.use("/users", AuthMiddleware.verifyToken);
app.use("/courses", AuthMiddleware.verifyToken);
app.use("/exams", AuthMiddleware.verifyToken);
app.use("/metrics", AuthMiddleware.verifyToken);
app.use("/admin", AuthMiddleware.verifyToken);
app.use("/", gateway);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
