// tool for testing HTTP calls
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
// assertion library
const { expect } = require("chai");
// Bring data in for testing
const { makeObservationsArray } = require("./observations.fixtures");

describe("GET /api/observations", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  //
  context("Given valid query parameters", () => {
    const testObservations = makeObservationsArray();
    const compareObservations = testObservations.map((item) => {
      return {
        id: item.id,
        individual_id: item.individual_id,
        time_stamp: item.time_stamp,
        study_id: item.study_id,
        individual_taxon_canonical_name: item.individual_taxon_canonical_name,
      };
    });

    it("Given no parameters, it responds with 200 and returns an array observations that is the right length", () => {
      return supertest(app)
        .get("/api/observations")
        .expect(200)
        .expect((res) => {
          expect(res.body.length).to.eql(testObservations.length);
        });
    });
    it("Given no parameters, it responds with 200 and returns the RIGHT array of observations", () => {
      return supertest(app)
        .get("/api/observations")
        .expect(200)
        .expect((res) => {
          expect(
            res.body.map((item) => {
              return {
                id: item.id,
                individual_id: item.individual_id,
                time_stamp: item.time_stamp,
                study_id: item.study_id,
                individual_taxon_canonical_name:
                  item.individual_taxon_canonical_name,
              };
            })
          ).to.deep.equal(compareObservations);
        });
    });
    it("Given an individual_id parameter, it returns and array of observations for that individual", () => {
      const raptorId = "KingTut";
      const filterId = (object) => object.individual_id === raptorId;
      const requestedRaptor = compareObservations
        .filter(filterId)
        .sort((a, b) => a.id - b.id);

      return supertest(app)
        .get("/api/observations/?individual_id=KingTut")
        .expect(200)
        .expect((res) => {
          expect(
            res.body
              .map((item) => {
                return {
                  id: item.id,
                  individual_id: item.individual_id,
                  time_stamp: item.time_stamp,
                  study_id: item.study_id,
                  individual_taxon_canonical_name:
                    item.individual_taxon_canonical_name,
                };
              })
              .filter(filterId)
              .sort((a, b) => a.id - b.id)
          ).to.deep.equal(requestedRaptor);
        });
    });
  });

  context("Given invalid query parameters", () => {
    it("Given an id that doesn't exist, it responds with 200 and returns an empty array", () => {
      return supertest(app)
        .get("/api/observations/?individual_id=FakeBird")
        .expect(200, []);
    });
  });
});

describe("GET /api/observations/last", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  //
  it("responds with 200 and returns an array of observations with one most recent observations per indvidual", () => {
    const getLastObservations = (arr) => {
      const raptorIds = {};
      arr.forEach((obs) => {
        if (!raptorIds[obs.individual_id]) {
          raptorIds[obs.individual_id] = [obs];
        } else {
          raptorIds[obs.individual_id].push(obs);
        }
      });
      let resultArr = [];
      Object.keys(raptorIds).forEach((raptor) => {
        raptorIds[raptor].sort((a, b) => {
          return (
            new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime()
          );
        });
        resultArr.push(raptorIds[raptor][0]);
      });
      return resultArr;
    };
    const testObservations = makeObservationsArray().map((item) => {
      return {
        individual_id: item.individual_id,
        time_stamp: item.time_stamp,
      };
    });
    const lastObservations = getLastObservations(testObservations);

    return supertest(app)
      .get("/api/observations/last")
      .expect(200)
      .expect((res) => {
        expect(
          getLastObservations(
            res.body.map((item) => {
              return {
                individual_id: item.individual_id,
                time_stamp: item.time_stamp,
              };
            })
          )
        ).to.deep.equal(lastObservations);
      });
  });
});

describe("GET /api/observations/first", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  //
  it("responds with 200 and returns an array of observations with one oldest observations per indvidual", () => {
    const getFirstObservations = (arr) => {
      const raptorIds = {};
      arr.forEach((obs) => {
        if (!raptorIds[obs.individual_id]) {
          raptorIds[obs.individual_id] = [obs];
        } else {
          raptorIds[obs.individual_id].push(obs);
        }
      });
      let resultArr = [];
      Object.keys(raptorIds).forEach((raptor) => {
        raptorIds[raptor].sort((a, b) => {
          return (
            new Date(a.time_stamp).getTime() - new Date(b.time_stamp).getTime()
          );
        });
        resultArr.push(raptorIds[raptor][0]);
      });
      return resultArr;
    };
    const testObservations = makeObservationsArray().map((item) => {
      return {
        individual_id: item.individual_id,
        time_stamp: item.time_stamp,
      };
    });
    const firstObservations = getFirstObservations(testObservations);

    return supertest(app)
      .get("/api/observations/first")
      .expect(200)
      .expect((res) => {
        expect(
          getFirstObservations(
            res.body.map((item) => {
              return {
                individual_id: item.individual_id,
                time_stamp: item.time_stamp,
              };
            })
          )
        ).to.deep.equal(firstObservations);
      });
  });
});
