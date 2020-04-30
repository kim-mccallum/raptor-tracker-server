const axios = require('axios');

// Change this and pass in some logic about dates 
// Connect to the database  - Need PG indexing to improve performance
// Get the most recent data in the database, convert this to be the 'timestamp_start' parameter (e.g., timestamp_start:1585720800000)
// Get current date and assign that to 'timestamp_end' (e.g., timestamp_end:`${new Date().getTime()}`)

// Maybe make a new module for putting the new data into the DB??

const fetchData = (params) => {
    const url = 'https://www.movebank.org/movebank/service/json-auth'
    const username = process.env.MB_USERNAME;
    const password = process.env.PASSWORD;

    return axios({
        method: 'GET',
        url,
        params,
        withCredentials: true,
        auth: {
            username,
            password
          }
    });
    //.then(function(response) {
    //    console.log('got the data!')
    //    callSomeFunction(response.data);
    //  })
    //.catch(function(error) {
    //    console.log(error);
    //});
}

module.exports = {
    fetchData
}