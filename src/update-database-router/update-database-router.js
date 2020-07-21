const express = require("express");
const UpdateService = require("./update-database-service.js");

const updateDatabaseRouter = express.Router();

updateDatabaseRouter
  .route("/")
  // no need to pass data so GET is fine
  .get((req, res, next) => {
    UpdateService.runAllUpdateDatabase()
      .then((response) => {
        console.log(response);
        res.json(response);
      })
      .catch((err) => console.log(err));
  });

module.exports = updateDatabaseRouter;
