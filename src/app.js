// require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, CLIENT_ORIGIN } = require("./config");
console.log(CLIENT_ORIGIN);
// Require route handler
const observationsRouter = require("./observations/observations-router");
const updateDatabaseRouter = require("./update-database-router/update-database-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
//
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

// Then implement router with api prefix
app.use("/api/observations", observationsRouter);

// Then implement router with api prefix for updates
app.use("/api/update-database", updateDatabaseRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
