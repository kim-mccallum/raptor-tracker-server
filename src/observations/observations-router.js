const express = require('express');
const ObservationsService = require('./observations-service');

const observationsRouter = express.Router()

observationsRouter
    .route('/')
    // MAYBE ADD MIDDLEWARE HERE TO CONVERT DATA TO GEOJSON FC AND ADD NOISE. MAYBE EVEN SEPARATE INDIVIDUALS
    .get((req, res, next) => {
        ObservationsService.getAllObservations(
            req.app.get('db')
        )
            .then(observations => {
                // change observations here
                // get random number -.9 to +.9 and multiply to make it smaller 
                // I THINK that multiplying by 0.1 would make this +/- about 1 km
                const changeCoords = (observation) => {
                    const randLat = ((Math.random() - 0.5) * 2 ) * 0.1;
                    const randLon = ((Math.random() - 0.5) * 2 ) * 0.1;
                    observation.location_long += randLon;
                    observation.location_lat += randLat;
                }
                observations.forEach(obs => {
                    console.log(obs)
                    changeCoords(obs)
                    console.log(obs)
                })
                
                res.json(observations)
            })
            .catch(next)
    })

module.exports = observationsRouter;