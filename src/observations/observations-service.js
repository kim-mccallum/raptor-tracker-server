const ObservationsService = { 
    // This one works and just returns the records from the observations table
    getAllObservations(knex, query){
        let { individual_id, start_time, end_time } = query;
        console.log(start_time)

        if(start_time){
            start_time = new Date(parseInt(start_time)).toISOString();
        }
        if(end_time){
            end_time = new Date(parseInt(end_time)).toISOString();
        }

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
    // Replicate the getAllObservations function above BUT figure out how to join the individual data
    // Join on 'individual_local_identifier' (FK) and add: individual_taxon_canonical_name (aka species) and study_id
    getAllObservationsJoin(knex, query){
        let { individual_id, start_time, end_time } = query;
        // get everything from observations with the species joined from the individuals table
        if(start_time){
            start_time = new Date(parseInt(start_time)).toISOString();
        }
        if(end_time){
            end_time = new Date(parseInt(end_time)).toISOString();
        }

        if(individual_id && start_time && end_time ){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('individual_id', individual_id)
            .where('time_stamp', '>=', start_time)
            .where('time_stamp', '<=', end_time)
        }
        else if(start_time && end_time ){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('time_stamp', '>=', start_time)
            .where('time_stamp', '<=', end_time)
        }
        else if(start_time && individual_id){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('individual_id', individual_id)            
            .where('time_stamp', '>=', start_time)
        }
        else if(end_time && individual_id){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('individual_id', individual_id)  
            .where('time_stamp', '<=', end_time)
        }
        else if(start_time){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')     
            .where('time_stamp', '>=', start_time)
        }
        else if(end_time){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier') 
            .where('time_stamp', '<=', end_time)
        }
        else if(individual_id){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('individual_id', individual_id)
        }
        return knex.from('observations')
                .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')                
    },
    getLastObservationById(knex){
        //THIS RETURNS THE RECORD WITH THE MAX TIMESTAMP FOR EACH INDIVIDUAL
        return knex.raw('SELECT * FROM observations t1 WHERE (t1.individual_id, t1.time_stamp) = ANY(SELECT t2.individual_id, max(t2.time_stamp) FROM observations t2 GROUP BY t2.individual_id);')
    },
    getFirstObservationById(knex){
        //THIS RETURNS THE RECORD WITH THE MIN TIMESTAMP FOR EACH INDIVIDUAL
        return knex.raw('SELECT * FROM observations t1 WHERE (t1.individual_id, t1.time_stamp) = ANY(SELECT t2.individual_id, min(t2.time_stamp) FROM observations t2 GROUP BY t2.individual_id);')
    }
}

module.exports = ObservationsService;