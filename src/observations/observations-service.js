const ObservationsService = { 
    getAllObservations(knex, query){
        const { individual_id, start_time, end_time } = query 

        if(individual_id && start_time && end_time ){
            return knex.from('observations').select('*')
            .where('individual_id', individual_id)
            .where('time_stamp', '>=', start_time)
            .where('time_stamp', '<=', end_time)
        }
        else if(start_time && end_time ){
            return knex.from('observations').select('*')
            .where('time_stamp', '>=', start_time)
            .where('time_stamp', '<=', end_time)
        }
        else if(start_time && individual_id){
            return knex.from('observations').select('*')
            .where('individual_id', individual_id)            
            .where('time_stamp', '>=', start_time)
        }
        else if(end_time && individual_id){
            return knex.from('observations').select('*')
            .where('individual_id', individual_id)  
            .where('time_stamp', '<=', end_time)
        }
        else if(start_time){
            return knex.from('observations').select('*')       
            .where('time_stamp', '>=', start_time)
        }
        else if(end_time){
            return knex.from('observations').select('*')  
            .where('time_stamp', '<=', end_time)
        }
        else if(individual_id){
            return knex.from('observations').select('*').where('individual_id', individual_id)
        }

        return knex.select('*').from('observations')
    },
    getObservationsByID(knex, query){
        console.log('split these up later')
    },
    getObservationsByDate(knex, query){
        console.log('split these up later')
    },
    getLastObservationById(knex){
        //THIS RETURNS THE RECORD WITH THE MAX TIMESTAMP FOR EACH INDIVIDUAL BUT THERE ARE ISSUES DUE TO ERRORS IN THE GPS FIX
        return knex.raw('SELECT * FROM observations t1 WHERE (t1.individual_id, t1.time_stamp) = ANY(SELECT t2.individual_id, max(t2.time_stamp) FROM observations t2 GROUP BY t2.individual_id);')
    }
}

module.exports = ObservationsService;