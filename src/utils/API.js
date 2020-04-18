const axios = require('axios');

const fetchData = () => {
    const url = 'https://www.movebank.org/movebank/service/json-auth'
    const username = process.env.MB_USERNAME;;
    const password = process.env.PASSWORD;
    console.log(username, password)
    const params = {
        study_id: '296675205',
        sensor_type:'gps',
        max_events_per_individual: '5'
    }

    axios({
        method: 'GET',
        url,
        params,
        withCredentials: true,
        auth: {
            username,
            password
          }
    })
    .then(function(response) {
        console.log(response.data.individuals);
      })
    .catch(function(error) {
        console.log(error);
    });
}

module.exports = {
    fetchData
}