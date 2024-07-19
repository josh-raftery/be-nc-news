const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET:200 sends an array of topics to the client", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    test('POST:201 Inserts a new topic and responds with the posted topic', () => {
      const requestData = {
         slug: "pigs",
         description: "not cows"
      }
      return request(app)
      .post('/api/topics')
      .send(requestData)
      .expect(201)
      .then(({body}) => {
        expect(body.topic).toEqual(requestData)
      });
     })
     test('POST:201 Inserts a new topic and responds with the posted topic, ignoring additional properties', () => {
      const requestData = {
         slug: "dogs",
         description: "not cats",
         topic_id: 5
      }
      return request(app)
      .post('/api/topics')
      .send(requestData)
      .expect(201)
      .then(({body}) => {
        expect(body.topic).toEqual({
          slug: "dogs",
          description: "not cats"
        })
      });
     })
     test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no slug)', () => {
       return request(app)
         .post("/api/topics")
         .send({
          description: "is fun"
        })
         .expect(400)
         .then((response) => {
           expect(response.body.msg).toBe('bad request');
         });
     });
     test('POST:400 responds with an appropriate status and error message when provided an invalid value data-type for slug', () => {
      return request(app)
        .post("/api/topics")
        .send({
         slug: 1,
         description: "is fun"
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test('POST:400 responds with an appropriate status and error message when provided an invalid value data-type for description', () => {
      return request(app)
        .post("/api/topics")
        .send({
         slug: "Coding",
         description: 1
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test('POST:400 responds with an appropriate status and error message when provided an existing slug is provided (primary key test)', () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "mitch",
          description: "not cats"
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
});