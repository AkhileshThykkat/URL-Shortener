const express = require("express");

const envVariables = require("./utils/env_loader");

const passport = require("./utils/auth");

const app = express();
app.use(express.json());

app.use(passport.initialize());

app.use(require("./routers/auth"));
app.use(require("./routers/shorten"));
app.use(require("./routers/analytics"));

app.listen(envVariables.PORT, () => {
  console.log(`Server running on port ${envVariables.PORT}`);
});

// const serverless = require("serverless-http");
// module.exports.handler = serverless(app);
