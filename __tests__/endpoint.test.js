const app = require("../endpoint/app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpointsData = require("../endpoints.json");
const comments = require("../db/data/test-data/comments.js");

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
});
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
describe("/api/articles/:article_id", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id data-type", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("/api/articles", () => {
  test("GET:200 sends an array of articles to the client", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
      });
  });
  test("GET:200 orders articles by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:200 comment_count property contains the number of comments that reference article_id", () => {
    const commentCountObject = {};
    comments.forEach((comment) => {
      let { article_id } = comment;
      if (!commentCountObject[article_id]) {
        commentCountObject[article_id] = 1;
      } else {
        commentCountObject[article_id]++;
      }
    });

    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          if (article.comment_count != "0") {
            expect(article.comment_count).toBe(
              String(commentCountObject[article.article_id])
            );
          }
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET:200 sends an array of comments to the client with an article_id of 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
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
  // this is for task 7, will uncomment after task 6 refactor!
  //test('GET:201 Inserts a new comment and responds with the posted comment', () => {
  //  const requestData = {
  //    "body": "Test post - insightful comment",
  //    "votes": 99,
  //    "author": "joshr",
  //    "article_id": 4,
  //    "created_at": 158302518065300,
  //  }
  //  return request(app)
  //  .post('/api/teams')
  //  .send(newTeam)
  //  .expect(201)
  //  .then(({body}) => {
  //    expect(body.comment.body).toBe(requestData.body);
  //    expect(body.comment.votes).toBe(requestData.votes);
  //    expect(body.comment.author).toBe(requestData.author);
  //    expect(body.comment.article_id).toBe(requestData.article_id);
  //    expect(body.comment.created_at).toBe(requestData.created_at);
  //    expect(body.comment.comment_id).toBe(comments.length);
  //  });
  //})
});
