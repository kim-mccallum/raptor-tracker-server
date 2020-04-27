const express = require('express');
const ObservationsService = require('./observations-service');

const observationsRouter = express.Router()

//Move this function the utils folder later
const changeCoords = (observation) => {
    const randLat = ((Math.random() - 0.5) * 2 ) * 0.01;
    const randLon = ((Math.random() - 0.5) * 2 ) * 0.01;
    observation.location_long += randLon;
    observation.location_lat += randLat;
}

observationsRouter
    .route('/')
    .get((req, res, next) => {
        ObservationsService.getAllObservations(
            req.app.get('db'), req.query
        )
            .then(observations => {
                console.log(observations)
                observations.forEach(obs => {
                    changeCoords(obs)
                })
                
                res.json(observations)
            })
            .catch(next)
    })
// More than likely abandon/get rid of this endpoint - it's not working right anyway
observationsRouter
    .route('/one-per-day')
    .get((req, res, next) => {
        ObservationsService.getOneObservationPerDay(
            req.app.get('db'), req.query
        )
            .then(observations => {
                console.log(observations)
                // observations.forEach(obs => {
                //     changeCoords(obs)
                // })
                
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
                    changeCoords(obs)
                })
                
                res.json(observations)
            })
            .catch(next)
    })
observationsRouter
    .route('/first')
    .get((req, res, next) => {
        ObservationsService.getFirstObservationById(
            req.app.get('db')
        )
        .then(observations => {
            observations = observations.rows
            observations.forEach(obs => {
                changeCoords(obs)
            })
            
            res.json(observations)
        })
        .catch(next)
})

module.exports = observationsRouter;