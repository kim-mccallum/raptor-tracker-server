const ObservationsService = { 
    // Join on 'individual_local_identifier' (FK) and add: individual_taxon_canonical_name (aka species) and study_id
    getAllObservationsJoin(knex, query){
        let { individual_id, start_time, end_time, study_id } = query;
        console.log(query, 'what is here?')

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
        else if(study_id && start_time && end_time ){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('time_stamp', '>=', start_time)
            .where('time_stamp', '<=', end_time)
            .where('individuals.study_id', '=', study_id)
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
        else if(study_id && start_time){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')     
            .where('time_stamp', '>=', start_time)
            .where('individuals.study_id', '=', study_id)
        }
        else if(study_id && end_time){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier') 
            .where('time_stamp', '<=', end_time)
            .where('individuals.study_id', '=', study_id)
        }
        else if(individual_id){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('individual_id', individual_id)
        }
        // check to see if study id then return 
        else if(study_id){
            return knex.from('observations')
            .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')
            .where('individuals.study_id', '=', study_id)
        }

        return knex.from('observations')
                .innerJoin('individuals', 'observations.individual_id','individuals.individual_local_identifier')                
    },
    getLastObservationById(knex){
        return knex.raw('SELECT * FROM (SELECT * FROM observations t1 WHERE (t1.individual_id, t1.time_stamp) = ANY(SELECT t2.individual_id, max(t2.time_stamp) FROM observations t2 GROUP BY t2.individual_id)) raptors JOIN individuals ON raptors.individual_id = individuals.individual_local_identifier;')
    },
    getFirstObservationById(knex){
        //THIS RETURNS THE RECORD WITH THE MIN TIMESTAMP FOR EACH INDIVIDUAL
        return knex.raw('SELECT * FROM (SELECT * FROM observations t1 WHERE (t1.individual_id, t1.time_stamp) = ANY(SELECT t2.individual_id, min(t2.time_stamp) FROM observations t2 GROUP BY t2.individual_id)) raptors JOIN individuals ON raptors.individual_id = individuals.individual_local_identifier;')
    }
}

module.exports = ObservationsService;