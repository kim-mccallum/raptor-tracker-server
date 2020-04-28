CREATE TABLE individuals (
    individual_local_identifier TEXT PRIMARY KEY,
    individual_taxon_canonical_name TEXT NOT NULL,
    study_id TEXT REFERENCES species_study(study_id) ON DELETE CASCADE NOT NULL
);