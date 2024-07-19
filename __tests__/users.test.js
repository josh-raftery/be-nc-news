const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const usersData = require("../db/data/test-data/users.js")

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('/api/users', () => {
    test("GET:200 sends an array of topics to the client", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toEqual(usersData)
        })
    });
  });
  describe('api/users/:username', () => {
    test("GET:200 sends an array of topics to the client", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
          })
        })
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/users/josh")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username not found");
        });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id data-type", () => {
      return request(app)
        .get("/api/users/1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    })
});