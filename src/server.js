require("dotenv").config();
const knex = require("knex");
const app = require("./app");
// module includes function to call API - maybe this should also do the db logic and insert into db?
// const API = require('./utils/API.js')

// const { PORT, DATABASE_URL } = require('./config');

// const db = knex({
//     client:'pg',
//     connection: DATABASE_URL,
// })

const { PORT, TEST_DATABASE_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: TEST_DATABASE_URL,
});

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  // setInterval could be used here with API.fetchData() passed as the callback?
  // setInterval(() => {console.log('ping')}, 1000)
  // API.fetchData();
});
