const app = require("../api/app.js");
const data = require("../db/data/test-data");
const db = require("../connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpointsData = require("../endpoints.json");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api", () => {
    test("GET:200 sends an array of endpoints to the client", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          expect(endpoints.length).toBe(endpointsData.length);
          for (let key in endpoints) {
            expect(typeof endpoints[key].description).toBe("string");
            expect(typeof endpoints[key].queries).toBe("object");
            expect(typeof endpoints[key].exampleResponse).toBe("object");
          }
        });
    });
});