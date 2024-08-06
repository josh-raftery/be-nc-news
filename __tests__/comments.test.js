const app = require("../app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const commentsData = require("../db/data/test-data/comments.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/articles/:article_id/comments", () => {
    test("GET:200 sends an array of comments to the client with an article_id of 1", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          body.comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.created_at).toBe("string");
          });
        });
    });
    test("GET:200 responds with an empty array when a valid, existing article_id is specified but there are no comments attached to it", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comments not found");
        });
    });
    test("GET:400 sends an appropriate status and error message when given an invalid id data-type", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("GET:200 array is sorted with most recent comments first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSortedBy("created_at");
        });
    });
    test('POST:201 Inserts a new comment and responds with the posted comment', () => {
     const requestData = {
       "body": "Test post - insightful comment",
       "author": "icellusedkars",
     }
     return request(app)
     .post('/api/articles/4/comments')
     .send(requestData)
     .expect(201)
     .then(({body}) => {
       expect(body.comment.body).toBe(requestData.body);
       expect(body.comment.votes).toBe(0);
       expect(body.comment.author).toBe(requestData.author);
       expect(body.comment.article_id).toBe(4);
       expect(typeof body.comment.created_at).toBe('string');
       expect(body.comment.comment_id).toBe(commentsData.length + 1);
     });
    })
    test('POST:201 Inserts a new comment and ignores unecessary properties', () => {
      const requestData = {
        "body": "Test post - insightful comment",
        "author": "icellusedkars",
        "votes": 100
      }
      return request(app)
      .post('/api/articles/4/comments')
      .send(requestData)
      .expect(201)
      .then(({body}) => {
        expect(body.comment.body).toBe(requestData.body);
        expect(body.comment.votes).toBe(0);
        expect(body.comment.author).toBe(requestData.author);
        expect(body.comment.article_id).toBe(4);
        expect(typeof body.comment.created_at).toBe('string');
        expect(body.comment.comment_id).toBe(commentsData.length + 2);
      });
     })
    test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no body)', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          "author": "icellusedkars",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test('POST:404 responds with an appropriate status and error message when given an invalid author(not referenced in users)', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          "body": "Test post - insightful comment",
          "author": "joshr",
        })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('not found');
        });
    });
    test("POST:400 sends an appropriate status and error message when given an invalid id data-type", () => {
      return request(app)
        .post("/api/articles/not-a-number/comments")
        .send({
          "body": "Test post - insightful comment",
          "author": "icellusedkars",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("POST:404 sends an appropriate status and error message when given a type-integer but non-existent id", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({
          "body": "Test post - insightful comment",
          "author": "icellusedkars",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    test("GET:200 sends an array of comments to the client, the amount specified by the limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2);
          expect(body.comments).toEqual([{
            comment_id: 9,
            body: 'Superficially charming',
            article_id: 1,
            author: 'icellusedkars',
            votes: 0,
            created_at: '2020-01-01T03:08:00.000Z'
          },
          {
            comment_id: 4,
            body: ' I carry a log — yes. Is it funny to you? It is not to me.',
            article_id: 1,
            author: 'icellusedkars',
            votes: -100,
            created_at: '2020-02-23T12:01:00.000Z'
          }])
      })
    });
    test("GET:200 sends an array of comments to the client, with the queries of limit=2 and p=2, it will respond with items 3-4 (second page)", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2)
          expect(body.comments).toEqual([{
            comment_id: 3,
            body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
            article_id: 1,
            author: 'icellusedkars',
            votes: 100,
            created_at: '2020-03-01T01:13:00.000Z'
          },
          {
            comment_id: 12,
            body: 'Massive intercranial brain haemorrhage',
            article_id: 1,
            author: 'icellusedkars',
            votes: 0,
            created_at: '2020-03-02T07:10:00.000Z'
          }])
        });
    });
    test("GET:200 sends an array of comments to the client, defaulting to a limit of 10 when no query is specified", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(10)
        });
    });
    test('GET:404 if you specify a page which suprpasses the amount of comments, get a response of page not found', () => {
      return request(app)
        .get("/api/articles/1/comments?limit=10&p=3")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('page not found')
        })
    })
    test('GET:400 if you specify string in the limit query, not a number - appropriate error message in response', () => {
      return request(app)
        .get("/api/articles/1/comments?limit=ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
    test('GET:400 if you specify string in the p query, not a number - appropriate error message in response', () => {
      return request(app)
        .get("/api/articles/1/comments?limit=10&p=one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
    test('GET:400 if you specify limit less than one, responds with appropriate error message', () => {
      return request(app)
        .get("/api/articles/1/comments?limit=-1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
  });
  describe('/api/comments/:comment_id', () => {
    test('DELETE:204 Deletes a comment and responds with no content', () => {
      return request(app)
      .delete('/api/comments/4')
      .expect(204)
     })
     test('DELETE:400 responds with an appropriate status and error message when provided with an invalid comment_id data-type', () => {
       return request(app)
         .delete("/api/comments/not-a-number")
         .expect(400)
         .then((response) => {
           expect(response.body.msg).toBe('bad request');
         });
     });
     test('DELETE:404 responds with an appropriate status and error message when given a valid but non-existant comment_id', () => {
       return request(app)
         .delete("/api/comments/999")
         .expect(404)
         .then((response) => {
           expect(response.body.msg).toBe('comment not found');
         });
     });
     test('PATCH:200 Updates a comment and responds with the patched comment', () => {
      const requestData = {
        "inc_votes": 1,
      }
      const expectedReponse = {
        comment_id: 2,
        body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        article_id: 1,
        author: 'butter_bridge',
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z"
      }
  
      expectedReponse.votes += requestData.inc_votes
  
      return request(app)
      .patch('/api/comments/2')
      .send(requestData)
      .expect(200)
      .then(({body}) => {
        expect(body.comment).toEqual(expectedReponse)
      });
    })

    test('PATCH:200 Updates a comment and responds with the patched comment - handling a decrement of votes not just an increment', () => {
      const requestData = {
        "inc_votes": -50,
      }
      const expectedReponse = {
        comment_id: 3,
        body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        article_id: 1,
        author: 'icellusedkars',
        votes: 100,
        created_at: "2020-03-01T01:13:00.000Z"
      }
  
      expectedReponse.votes += requestData.inc_votes
  
      return request(app)
      .patch('/api/comments/3')
      .send(requestData)
      .expect(200)
      .then(({body}) => {
        expect(body.comment).toEqual(expectedReponse)
      });
    })
    test('PATCH:200 Updates a comment and responds with the patched comment - ignoring additional properties in the request', () => {
      const requestData = {
        "inc_votes": -50,
        "body": 'new body'
      }
      const expectedReponse = {
        comment_id: 1,
        article_id: 9,
        author: "butter_bridge",
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        created_at: "2020-04-06T12:17:00.000Z",
        votes: 16,
      }
  
      expectedReponse.votes += requestData.inc_votes
  
      return request(app)
      .patch('/api/comments/1')
      .send(requestData)
      .expect(200)
      .then(({body}) => {
        expect(body.comment).toEqual(expectedReponse)
      });
    })
    test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({
        "inc_votes": 1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
    });
    test("PATCH:400 sends an appropriate status and error message when given an invalid id data-type", () => {
      return request(app)
        .patch("/api/comments/not-a-number")
        .send({
          "inc_votes": 1,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid inc_votes data-type', () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(400)
        .send({
          "inc_votes": "one"
        })
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    })
    test('PATCH:400 sends an appropriate status and error message when given an invalid request body', () => {
      return request(app)
        .patch("/api/comments/not-a-number")
        .expect(400)
        .send({
          "body": "test body"
        })
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    })
})