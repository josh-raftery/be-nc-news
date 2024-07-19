const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("invalid enpoint - edge case", () => {
    test('GET:404 "invalid endpoint" with a path of /api/topiks', () => {
        return request(app)
        .get("/api/topiks")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("invalid endpoint");
        });
    });
});