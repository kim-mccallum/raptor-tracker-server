CREATE TABLE individuals (
    individual_local_identifier TEXT PRIMARY KEY,
    study_id TEXT REFERENCES species_study(study_id) ON DELETE CASCADE NOT NULL
);