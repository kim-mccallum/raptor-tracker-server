const ObservationsService = { 
    getAllObservations(knex){
        return knex.select('*').from('observations')
    }
}

module.exports = ObservationsService;