const express = require("express");

const swaggerUi = require("swagger-ui-express");
const path = require("path");
const yaml = require("yamljs");

const cors = require("cors");

const envVariables = require("./utils/env_loader");
const passport = require("./utils/auth");

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = yaml.load(swaggerPath);

const app = express();
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(require("./routers/auth"));
app.use(require("./routers/shorten"));
app.use(require("./routers/analytics"));

app.listen(envVariables.PORT, () => {
  console.log(`Server running on port ${envVariables.PORT}`);
});
