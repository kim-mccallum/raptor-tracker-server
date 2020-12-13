const express = require("express");

const updateDatabaseRouter = express.Router();

updateDatabaseRouter.route("/").get((req, res, next) => {
  const runAllUpdateDatabase = () => {
    // trigger the database update function
    require("dotenv").config();
    const knex = require("knex");
    const API = require("../utils/API");
    const { DATABASE_URL } = require("../config");

    let db = knex({
      client: "pg",
      connection: DATABASE_URL,
    });
    // initiate global variable to return
    let responseData;

    //Dates to get
    const timestamp_start = new Date("2019-01-01").getTime();
    const timestamp_end = new Date("2020-04-30").getTime();
    // African vulture and golden eagles MoveBank study ids
    const studyIds = ["473993694", "296675205"];

    let params = {
      //study_id: studyId,
      sensor_type: "gps",
      // max_events_per_individual: "5",
      // individual_local_identifiers[]: 'TomPetty',
      // attributes: 'timestamp, location_long, location_lat, ground_speed, heading',
      attributes: "all",
      timestamp_start,
      timestamp_end,
    };

    const updateDatabase = async function () {
      const startDateObj = await db.raw(
        "SELECT time_stamp FROM last_update_time;"
      );
      // ADD LOGIC HERE - ONLY REQUEST NEW DATA IF THE DATABASE IS OUT OF DATE (THE startDate IS MORE THAN ONE DAY OLDER THAN TODAY)
      const startDateStr = startDateObj.rows[0]["time_stamp"];
      const startDate = new Date(startDateStr).getTime();

      const currentDate = new Date().getTime();
      console.log("date check", currentDate - startDate);
      // console.log("date check", currentDate, startDate);
      // if the difference between today and the last date represents more than 1 day in milliseconds
      if (currentDate - startDate > 8.64e7) {
        console.log(`database is out of date and needs to update...`);
        // set up or reset the database with a startime
        await addDefaultLastUpdateTime();
        // update the last date in the database
        await updateTimestamp();

        // set up parameters for the fetch
        params["timestamp_start"] = startDate;
        params["timestamp_end"] = currentDate;

        await asyncForEach(studyIds, async (studyId) => {
          params["study_id"] = studyId;

          console.log(
            `Fetching data for study id ${studyId} with params ${JSON.stringify(
              params
            )}`
          );
          const response = await API.fetchData(params);
          // set the data to the global so we can return it
          responseData = response.data;
          console.log(`TESTING`, responseData);
          await insertData(response.data, studyId);
        });
      } else {
        //if you don't update, just return the correct structure
        responseData = { individuals: [] };
      }
    };

    // change the variable name for eagles to response
    const insertData = async function (eagles, studyId) {
      try {
        // See if this entry is already in the database
        const existingId = await db("species_study")
          .where({ study_id: studyId })
          .select("study_id");
        if (existingId.length === 0) {
          await db("species_study").insert({ study_id: studyId });
        }

        await asyncForEach(eagles.individuals, async (ind) => {
          const individualParams = {
            individual_local_identifier: ind.individual_local_identifier,
            individual_taxon_canonical_name:
              ind.individual_taxon_canonical_name,
            study_id: ind.study_id,
          };

          const existingInd = await db("individuals")
            .where(individualParams)
            .select("study_id");
          if (existingInd.length === 0) {
            await db("individuals").insert(individualParams);
          }

          // Within that individual, loop over locations and put data into observations
          await asyncForEach(ind.locations, async (obs) => {
            //   Leave out erroneous timestamps in the future
            if (Number(obs.timestamp) < new Date().getTime()) {
              const obsParams = {
                individual_id: ind.individual_local_identifier,
                time_stamp: new Date(parseInt(obs.timestamp)).toISOString(),
                location_long: obs.location_long,
                location_lat: obs.location_lat,
                heading: obs.heading,
                ground_speed: obs.ground_speed,
              };

              const existingObs = await db("observations")
                .where(obsParams)
                .select("individual_id");
              if (existingObs.length === 0) {
                await db("observations").insert(obsParams);
              }
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    // Pass true if you if you clobber your database and need to start over - force overwrite
    // Want to use the insert if the database is empty
    const addDefaultLastUpdateTime = async function (force = false) {
      const existingTimestamp = await db("last_update_time").select(
        "time_stamp"
      );
      if (existingTimestamp.length === 0) {
        console.log("Add a default date into the database: 2010-01-01 9:30:20");
        try {
          await db.raw(
            "INSERT INTO last_update_time (time_stamp) VALUES (TO_TIMESTAMP ('2010-01-01 9:30:20','YYYY-MM-DD HH:MI:SS'));"
          );
        } catch (error) {
          console.log(error);
        }
      } else if (force) {
        console.log(
          "Overwriting default date into the database: 2010-01-01 9:30:20"
        );
        try {
          await db.raw(
            // change this to be distant past such as 2010
            "UPDATE last_update_time SET time_stamp = TO_TIMESTAMP ('2019-01-01 9:30:20','YYYY-MM-DD HH:MI:SS') WHERE id = (SELECT id FROM last_update_time LIMIT 1);"
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(
          `Found timestamp in database: ${existingTimestamp[0]["time_stamp"]}`
        );
      }
    };

    const updateTimestamp = async function () {
      await db.raw(
        "UPDATE last_update_time SET time_stamp = NOW() WHERE id = (SELECT id FROM last_update_time LIMIT 1);"
      );
    };
    // call all the functions to check last date, fetch and insert new data
    const runUpdate = async function () {
      // await addDefaultLastUpdateTime(); // add true to params to reset, eg addDefaultLastUpdateTime(true)
      await updateDatabase();
      await db.destroy();
      return responseData;
    };

    runUpdate().then((newData) => {
      // figure out how to pass this to router
      console.log("here is the response in the router:", newData);
      // pass the new observations back to the client
      res.json(newData);
    });
  };
  // fun all the functions to update the database with new observation data
  runAllUpdateDatabase();
});

module.exports = updateDatabaseRouter;
