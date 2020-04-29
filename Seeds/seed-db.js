
require('dotenv').config();
const knex = require('knex');
const API = require('../src/utils/API.js')
// const { eagles } = require('./golden-eagle-data-test');
const { DATABASE_URL } = require('../src/config');

let db = knex({
    client:'pg',
    connection: DATABASE_URL,
})
//   // TO DO: 
//   // Figure out how to close the connection - the script is hanging on for some reason
//   // Add error handling
//   // Add robust logging in addition to error handling so that we can go back and check/troubleshoot
//   // What happened, error message, etc. What if your Cron job crashes?

//Dates to get
const timestamp_start = new Date('2020-01-01').getTime()
const timestamp_end = new Date().getTime()
// Vultures
const study_id = '473993694'
// Golden eagles
// const study_id = '296675205'

const params = {
    study_id: study_id,
    sensor_type:'gps',
    // max_events_per_individual: '5',
    // attributes: 'timestamp, location_long, location_lat, ground_speed, heading',
    attributes: 'all',
    timestamp_start,
    timestamp_end
}

callSomeFunction = (eagles) => {
    console.log(eagles)
    console.log('putting it into the db... ')

    db('species_study').insert(
        // Change this to just take the study_id parameter IS THERE A BETTER WAY TO PASS THIS PARAMETER?
        {study_id: study_id}
      ).then(() => {
        // SECOND map over the individuals and put them into the individuals table
        eagles.individuals.forEach(ind => {
            //this works
            db('individuals').insert({
                individual_local_identifier: ind.individual_local_identifier,
                // add species but add this to the database first
                individual_taxon_canonical_name: ind.individual_taxon_canonical_name,
                study_id: ind.study_id
            })
            // THIRD Within that individual, map over locations and put data into observations
            .then(()=> {
                  ind.locations.forEach(obs => {
                    //   Leave out erroneous timestamps in the future
                    if(Number(obs.timestamp) < new Date().getTime()){
                        db('observations').insert({
                            individual_id: ind.individual_local_identifier,
                            time_stamp: new Date(parseInt(obs.timestamp)).toISOString(),
                            location_long: obs.location_long,
                            location_lat: obs.location_lat, 
                            heading: obs.heading,
                            ground_speed: obs.ground_speed
                        }).then(() => {console.log(`We inserted ${JSON.stringify(obs)}`)})
                      }
                })
            })
        })
      })
   }
   
const eagles = API.fetchData(params, callSomeFunction );






  

       
