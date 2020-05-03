// tool for testing HTTP calls
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
// assertion library
const { expect } = require("chai");
// Bring data in for testing
const { makeObservationsArray } = require("./observations.fixtures");

describe.only("GET /api/observations", () => {
  let db;

  console.log(process.env.TEST_DATABASE_URL);

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

    it("responds with 200 and returns an array of all the observations", () => {
      return supertest(app)
        .get("/api/observations")
        .expect(200, testObservations);
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

// describe("GET /api/observations/last", () => {
//   // Connect to the database?
//   // How to make test that these are the last/most recent observations?
// });
