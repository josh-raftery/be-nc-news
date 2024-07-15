const app = require("../endpoint/app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpointsData = require('../endpoints.json')

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('invalid enpoint - edge case', () => {
    test('GET:404 "invalid endpoint" with a path of /api/topiks', () => {
        return request(app)
            .get('/api/topiks')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('invalid endpoint')
            })
    })
})
describe('/api/topics', () => {
    test("GET:200 sends an array of topics to the client", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
});
describe('/api', () => {
    test("GET:200 sends an array of endpoints to the client", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({body}) => {
            const {endpoints} = body
            expect(endpoints.length).toBe(endpointsData.length);
            for(let key in endpoints){
              expect(typeof endpoints[key].description).toBe("string");
              expect(typeof endpoints[key].queries).toBe("object");
              expect(typeof endpoints[key].exampleResponse).toBe("object");
            };
          });
      });
})