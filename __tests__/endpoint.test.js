const app = require("../endpoint/app.js");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const endpointsData = require("../endpoints.json");
const comments = require("../db/data/test-data/comments.js");
const usersData = require("../db/data/test-data/users.js")

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
  test('PATCH:200 Updates an article comment and responds with the patched article', () => {
    const requestData = {
      "inc_votes": 1,
    }
    const expectedReponse = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    }

    expectedReponse.votes += requestData.inc_votes

    return request(app)
    .patch('/api/articles/1')
    .send(requestData)
    .expect(200)
    .then(({body}) => {
      expect(body.article).toEqual(expectedReponse)
    });
  })
  test('PATCH:200 Updates an article comment and responds with the patched article - handling a decrement of votes not just an increment', () => {
    const requestData = {
      "inc_votes": -50,
    }
    const expectedReponse = {
      author: 'icellusedkars',
      body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
      title: 'Am I a cat?',
      article_id: 11,
      topic: 'mitch',
      created_at: '2020-01-15T22:21:00.000Z',
      votes: 0,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    }

    expectedReponse.votes += requestData.inc_votes

    return request(app)
    .patch('/api/articles/11')
    .send(requestData)
    .expect(200)
    .then(({body}) => {
      expect(body.article).toEqual(expectedReponse)
    });
  })
  test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
  return request(app)
    .patch("/api/articles/999")
    .send({
      "inc_votes": 1,
    })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("article not found");
    });
  });
  test("PATCH:400 sends an appropriate status and error message when given an invalid id data-type", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
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
      .patch("/api/articles/not-a-number")
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
      .patch("/api/articles/not-a-number")
      .expect(400)
      .send({
        "body": "test body"
      })
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  })
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
          expect(typeof article.comment_count).toBe("number");
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
          if (article.comment_count != 0) {
            expect(article.comment_count).toBe(
              commentCountObject[article.article_id]
            );
          }
        });
      });
  });
  test('GET:200 Response is sorted by title when title is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=title")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("title", { descending: true });
    })
  })
  test('GET:200 Response is sorted by topic when topic is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=topic")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("topic", { descending: true });
    })
  })
  test('GET:200 Response is sorted by author when author is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=author")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("author", { descending: true });
    })
  })
  test('GET:200 Response is sorted by votes when votes is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("votes", { descending: true });
    })
  })
  test('GET:200 Response is sorted by article_img_url when article_img_url is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=article_img_url")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("article_img_url", { descending: true });
    })
  })
  test('GET:200 Response is sorted by article_id when article_id is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=article_id")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("article_id", { descending: true });
    })
  })
  test('GET:200 Response is sorted by comment_count when comment_count is provided in the query', () => {
    return request(app)
    .get("/api/articles?sort_by=comment_count")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("comment_count", { descending: true });
    })
  })
  test('GET:200 Response is sorted by created_at in descending order, when "desc" is specified in the order query', () => {
    return request(app)
    .get("/api/articles?order=desc")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("created_at", { descending: true });
    })
  })
  test('GET:200 Response is ordered by ascending if it is specified in the query and the function can handle 2 queries', () => {
    return request(app)
    .get("/api/articles?order=asc&sort_by=title")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBe(13)
      expect(body.articles).toBeSortedBy("title", { descending: false });
    })
  })
  test('GET:404 Response message of not found if query is not a valid column', () => {
    return request(app)
    .get("/api/articles?sort_by=invalid-column")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toEqual('not found')
    })
  })
  test('GET:404 Response message of not found if query is not a valid ordering criteria', () => {
    return request(app)
    .get("/api/articles?order=invalid-order")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toEqual('not found')
    })
  })
  test('GET:400 Appropriate error message when a query-type other that "sort_by" or "order is specified"', () => {
    return request(app)
    .get("/api/articles?ord=asc")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toEqual('bad request')
    })
  })
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
     expect(body.comment.comment_id).toBe(comments.length + 1);
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
      expect(body.comment.comment_id).toBe(comments.length + 2);
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
})
describe('/api/users', () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(usersData)
      })
  });
})