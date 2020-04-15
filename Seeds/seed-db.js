
const knex = require('knex');
// const app = require('../src/app');
const { eagles } = require('./golden-eagle-data-test');
const { DATABASE_URL } = require('../src/config');

let db = knex({
    client:'pg',
    connection: DATABASE_URL,
})

//// WHEN I DO IT THIS WAY POPULATING THE FIRST TWO TABLES WORKS BUT NOT THE THIRD (observations)
// FIRST insert the study id into the species_study table
db('species_study').insert(
    {study_id: eagles.individuals[0].study_id, individual_taxon_canonical_name: eagles.individuals[0].individual_taxon_canonical_name}
).then(() => {
    // SECOND map over the individuals and put them into the individuals table
    eagles.individuals.map(ind => {
        //this works
        db('individuals').insert({
            individual_local_identifier: ind.individual_local_identifier,
            study_id: ind.study_id
        })
        // THIRD Within that individual, map over locations and put data into observations
        .then(()=> {
            // Not working - ind is not defined in here??? 
            ind.locations.map(obs => {
                db('observations').insert({
                    individual_id: ind.individual_local_identifier,
                    time_stamp: obs.timestamp,
                    location_long: obs.location_long,
                    location_lat: obs.location_lat, 
                    heading: obs.heading,
                    height_raw: obs.height_raw, 
                    ground_speed: obs.ground_speed
                })
            })
        })
    })
})


//// WHEN I DO IT THIS WAY NOTHING WORKS
//First 
// db('species_study').insert(
//     {study_id: eagles.individuals[0].study_id, individual_taxon_canonical_name: eagles.individuals[0].individual_taxon_canonical_name}
// ).then(() => {
//     // SECOND map over the individuals and put them into the individuals table
//     eagles.individuals.map(ind => {
//         //this works
//         db('individuals').insert({
//             individual_local_identifier: ind.individual_local_identifier,
//             study_id: ind.study_id
//         })
//     })
// }).then(() => {
//     console.log('done with species_study and individuals')
// });

// // THIRD Within that individual, map over locations and put data into observations
// eagles.individuals.map(ind => {
//     ind.locations.map((obs) => {
//         db('observations').insert({
//             individual_id: ind.individual_local_identifier,
//             time_stamp: obs.timestamp,
//             location_long: obs.location_long,
//             location_lat: obs.location_lat, 
//             heading: obs.heading,
//             ground_speed: obs.ground_speed
//         }).then() 
//         // console.log(`Individual: ${ind.individual_local_identifier}`)
//         // console.log(`Some timestamp: ${typeof(obs.timestamp)}`)
//         // console.log(`Some ground_speed: ${typeof(obs.ground_speed)}`)
//         // console.log(`Some location_lat: ${typeof(obs.location_lat)}`)
//     })
// })



       
