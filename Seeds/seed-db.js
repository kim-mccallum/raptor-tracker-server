
const knex = require('knex');
// const app = require('../src/app');
const { eagles } = require('./golden-eagle-data-test');
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
//   .then(() => {
//     db.destroy();
//     console.log('Hoorah!')
//   })

db('species_study').insert(
    // update this when you have more studies
    {study_id: eagles.individuals[0].study_id, individual_taxon_canonical_name: eagles.individuals[0].individual_taxon_canonical_name}
  ).then(() => {
    // SECOND map over the individuals and put them into the individuals table
    eagles.individuals.forEach(ind => {
        //this works
        db('individuals').insert({
            individual_local_identifier: ind.individual_local_identifier,
            study_id: ind.study_id
        })
        // THIRD Within that individual, map over locations and put data into observations
        .then(()=> {
              ind.locations.forEach(obs => {
                db('observations').insert({
                    individual_id: ind.individual_local_identifier,
                    time_stamp: obs.timestamp,
                    location_long: obs.location_long,
                    location_lat: obs.location_lat, 
                    heading: obs.heading,
                    ground_speed: obs.ground_speed
                }).then(() => {console.log(`We inserted ${JSON.stringify(obs)}`)})
            })
        })
    })
  })


  

       
