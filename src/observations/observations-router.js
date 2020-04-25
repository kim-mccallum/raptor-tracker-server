const express = require('express');
const ObservationsService = require('./observations-service');

const observationsRouter = express.Router()

//Move this function the utils folder later
const changeCoords = (observation) => {
    const randLat = ((Math.random() - 0.5) * 2 ) * 0.1;
    const randLon = ((Math.random() - 0.5) * 2 ) * 0.1;
    observation.location_long += randLon;
    observation.location_lat += randLat;
}

observationsRouter
    .route('/')
    .get((req, res, next) => {
        // ObservationsService.getAllObservations(
        ObservationsService.getOneObservationPerDay(
            req.app.get('db'), req.query
        )
            .then(observations => {
                observations.forEach(obs => {
                    // console.log('changing coords')
                    changeCoords(obs)
                })
                
                res.json(observations)
            })
            .catch(next)
    })

observationsRouter
    .route('/last')
    .get((req, res, next) => {
        ObservationsService.getLastObservationById(
            req.app.get('db')
        )
            .then(observations => {
                observations = observations.rows
                observations.forEach(obs => {
                    console.log('changing coords')
                    changeCoords(obs)
                })
                
                res.json(observations)
            })
            .catch(next)
    })

module.exports = observationsRouter;