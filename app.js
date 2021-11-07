const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const gateway = require("./infrastructure/routes/gateway");
const AuthMiddleware = require("./application/middlewares/AuthMiddleware");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/authorization/users", AuthMiddleware.verifyToken); // no esta probado todavia

app.use("/", gateway);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
  // console.log(`App running on port ${process.env.PORT}`);
});
