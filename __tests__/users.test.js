const app = require("../api/app.js");
const data = require("../db/data/test-data");
const db = require("../connection");
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
    test('POST:201 Valid response upon valid request', () =>{
      const req = {
        username: "josh99",
        name: "josh",
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
      }
      return request(app)
        .post("/api/users")
        .send(req)
        .expect(201)
        .then(({body}) => {
          expect(body.user).toEqual(req)
        })
    })
    test('POST:201 Valid response upon valid request with surplus fields', () =>{
      return request(app)
        .post("/api/users")
        .send({
          username: "testing",
          name: "josh",
          nickname: "J",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        })
        .expect(201)
        .then(({body}) => {
          expect(body.user).toEqual({
            username: "testing",
            name: "josh",
            avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          })
        })
    })
    test('POST:409 Error response when anon-unique username is provided', () =>{
      const req = {
        username: "josh99",
        name: "josh",
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
      }
      return request(app)
        .post("/api/users")
        .send(req)
        .expect(409)
        .then(({body}) => {
          expect(body.msg).toBe("username already exists")
        })
    })
    test('POST:400 Error response when request field missing', () =>{
      const req = {
        username: "josh999",
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
      }
      return request(app)
        .post("/api/users")
        .send(req)
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("bad request")
        })
    })
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
    test("PATCH:200 Updates the user and responds with the patched user", () => {
      return request(app)
      .patch('/api/users/icellusedkars')
      .send({
        name: 'jonathon',
        avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
      })
      .expect(200)
      .then(({body}) => {
        expect(body.user).toEqual({
          username: "icellusedkars",
          name: 'jonathon',
          avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
        })
      });
    })

    test('PATCH:200 Updates the user and responds with the patched user - ignoring additional properties in the request', () => {
  
      return request(app)
      .patch('/api/users/icellusedkars')
      .send({
        name: 'jonathon',
        avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        nickname: "mitch"
      })
      .expect(200)
      .then(({body}) => {
        expect(body.user).toEqual({
          username: "icellusedkars",
          name: 'jonathon',
          avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
        })
      });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/users/joshraftery")
      .send({
        name: 'jonathon',
        avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid request body', () => {
      return request(app)
        .patch("/api/users/icellusedkars")
        .expect(400)
        .send({
          "body": "test body"
        })
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    })
});