const express = require("express");
const UpdateService = require("./update-database-service.js");

const updateDatabaseRouter = express.Router();

updateDatabaseRouter
  .route("/")
  // no need to pass data so GET is fine
  .get((req, res, next) => {
    // const newData = UpdateService.runAllUpdateDatabase();
    // console.log(newData);
    const newDataPromise = new Promise(UpdateService.runAllUpdateDatabase).then(
      (res) => {
        console.log("what is this", res);
      }
    );
    // send to the client
    // res.json(newData);
    // .then((response) => {
    //   console.log(response);
    //   res.json(response);
    // })
    // .catch((err) => console.log(err));
  });

module.exports = updateDatabaseRouter;
