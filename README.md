# Northcoders News API

## Requirements

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

## API Address

**https://be-nc-news-ml9n.onrender.com/api**

## Summary

This API was built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Setup

First clone and assign to a repo of your creation, or simply fork the repo. 

Then run: `npm install` in your command terminal to install all dependencies.

## Testing

There are two sets of data available for seeding the database: development and test (this eludes to the environment variables you set up prior). 

Use jest to create tests for the various endpoints and the system will detect this and assign system variable: NODE_ENV to test, picked up by our connection.js file.

Add this code to the beginning of any test file requiring queries to the database:

`const db = require("../db/connection");`

`const seed = require("../db/seeds/seed.js");`

`const data = require("../db/data/test-data");`

`beforeAll(() => seed(data));`

`afterAll(() => db.end());`

This will mean data will not persist any you can test (relatively) in isolation.

## Software Requirements

node version: **>=14** required

postgres version: **>=8.8** required