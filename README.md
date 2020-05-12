# [Raptor Tracker](https://raptor-tracker-app.now.sh/) Server

If you have not already, please read the [Raptor Tracker client readme](https://github.com/kim-mccallum/raptor-tracker-client/blob/master/README.md) for information about this project.

## About

This API services the Raptor Tracker react client application and comprises an Express server coupled with a PostgreSQL database. The database stores location data obtained from remote, solar-powered satellite transmitter deployed on Golden Eagles and several endangered species of African vultures. Because these raptors are protected and their locations sensitive, locations are securely handled on this backend server. Raptor location data are automatically sent from the locators on the birds to an animal tracking database called [Movebank](https://www.movebank.org/cms/movebank-main). This back-end application fetches data using Axios JS and stores it in the PostgreSQL database. The Express endpoints in this API add small random 'noise' to the geographic coordinates in the responses returned to the client so that displayed locations are within 1km of the actual observed location. This is to protect the actual, exact locations of the raptors.

A typical request pattern looks like this:

- A user visits the Raptor Tracker client application and the most recent (last) observations of each individual raptor in the database are returned to be rendered on the map.
- A user selects a raptor from the map and data from that individual are returned to the client for the default period of the last month.
- A user filters data by study (African vultures or Golden Eagles), recent time period (last week, last month or last year) or selects a custom date range. For each type of request, query strings are used to pull data from the database and return the appropriate response to the client.

## Technologies

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Knex.js](http://knexjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Axios](https://www.npmjs.com/package/axios)

#### Notes

Raptor Tracker is currently hosted on Heroku and as such, the API can take a few moments to 'wake up' when you first interact with it. Currently, the database that is deployed represents two years of recent raptor tracking data. Soon, this database will be updating itself.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When this project is ready to be updated and redeployed, simply run `npm run build` and then `npm run deploy` which will push to this remote's master branch.
