const app = require("../api/app.js");
const data = require("../db/data/test-data");
const db = require("../connection");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const commentsData = require("../db/data/test-data/comments.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

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
            comment_count: 11
          });
      });
    });
    test('GET:200 We still recieve an array of articles when comment count is 0 - test the join', () => {
  
      return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          author: 'icellusedkars',
          body: "I was hungry.",
          title: 'Z',
          article_id: 7,
          topic: 'mitch',
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          comment_count: 0
        })
      })
    })
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
    test('PATCH:200 Updates an article comment and responds with the patched article - ignoring additional request properies', () => {
      const requestData = {
        "inc_votes": -50,
        body: "new body"
      }
      const expectedReponse = {
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: "2020-10-11T11:24:00.000Z",
        title: "Moustache",
        article_id: 12,
        topic: 'mitch',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      }
  
      expectedReponse.votes += requestData.inc_votes
  
      return request(app)
      .patch('/api/articles/12')
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
        .patch("/api/articles/1")
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
    test('DELETE:204 Deletes a comment and responds with no content, deleting all comment associated with the article', () => {
      return request(app)
      .delete('/api/articles/11')
      .expect(204)
      .then(() => {
        return request(app)
        .get("/api/articles/11/comments")
        .expect(404)
      })
     })
     test('DELETE:400 responds with an appropriate status and error message when provided with an invalid comment_id data-type', () => {
       return request(app)
         .delete("/api/articles/not-a-number")
         .expect(400)
         .then((response) => {
           expect(response.body.msg).toBe('bad request');
         });
     });
     test('DELETE:404 responds with an appropriate status and error message when given a valid but non-existant comment_id', () => {
       return request(app)
         .delete("/api/articles/999")
         .expect(404)
         .then((response) => {
           expect(response.body.msg).toBe('article not found');
         });
     });
  });
  describe("/api/articles", () => {
    test("GET:200 sends an array of articles to the client", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          
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
      commentsData.forEach((comment) => {
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
        expect(body.articles).toBeSortedBy("title", { descending: true });
      })
    })
    test('Response is filtered by topic', () => {
      return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {   
        body.articles.forEach((article) => {
          expect(article.topic).toBe('mitch')
        })
      })
    })
    test('Response is filtered by topic', () => {
      return request(app)
      .get("/api/articles?topic=ffdsd")
      .expect(404)
      .then(({ body }) => {   
        expect(body.msg).toEqual('page not found')
      })
    })
    test('GET:400 Appropriate error message is returned when a topic with an invalid type is entered', () => {
      return request(app)
      .get("/api/articles?topic=1")
      .expect(400)
      .then(({ body }) => {   
        expect(body.msg).toEqual('bad request')
      })
    })
    test('GET:200 Response is filtered by title', () => {
      return request(app)
      .get("/api/articles?title=shadow")
      .expect(200)
      .then(({ body }) => {   
        body.articles.forEach((article) => {
          expect(article.article_id).toBe(1)
        })
      })
    })
    test('GET:200 Query is case-insensitive', () => {
      return request(app)
      .get("/api/articles?title=ShAdoW")
      .expect(200)
      .then(({ body }) => {   
        body.articles.forEach((article) => {
          expect(article.article_id).toBe(1)
        })
      })
    })
    test('GET:404 Appropriate error message is returned when a non existant topic is provided', () => {
      return request(app)
      .get("/api/articles?title=ffdsd")
      .expect(404)
      .then(({ body }) => {   
        expect(body.msg).toEqual('page not found')
      })
    })
   test('GET:200 Response is sorted by topic when topic is provided in the query', () => {
      return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {   
        expect(body.articles).toBeSortedBy("topic", { descending: true });
      })
    })
    test('GET:200 Response is sorted by author when author is provided in the query', () => {
      return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => { 
        expect(body.articles).toBeSortedBy("author", { descending: true });
      })
    })
    test('GET:200 Response is sorted by votes when votes is provided in the query', () => {
      return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => { 
        expect(body.articles).toBeSortedBy("votes", { descending: true });
      })
    })
    test('GET:200 Response is sorted by article_img_url when article_img_url is provided in the query', () => {
      return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(200)
      .then(({ body }) => { 
        expect(body.articles).toBeSortedBy("article_img_url", { descending: true });
      })
    })
    test('GET:200 Response is sorted by article_id when article_id is provided in the query', () => {
      return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {    
        expect(body.articles).toBeSortedBy("article_id", { descending: true });
      })
    })
    test('GET:200 Response is sorted by comment_count when comment_count is provided in the query', () => {
      return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {    
        expect(body.articles).toBeSortedBy("comment_count", { descending: true });
      })
    })
    test('GET:200 Response is sorted by created_at in descending order, when "desc" is specified in the order query', () => {
      return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body }) => { 
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      })
    })
    test('GET:200 Response is ordered by ascending if it is specified in the query and the function can handle 2 queries', () => {
      return request(app)
      .get("/api/articles?order=asc&sort_by=title")
      .expect(200)
      .then(({ body }) => {   
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
    test('POST:201 Inserts a new article and responds with the posted article', () => {
      const requestData = {
        author: 'icellusedkars',
        title: 'Z',
        topic: 'mitch',
        body: 'test post',
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
      return request(app)
      .post('/api/articles')
      .send(requestData)
      .expect(201)
      .then(({body}) => {
        expect(body.article.body).toBe(requestData.body);
        expect(body.article.topic).toBe(requestData.topic);
        expect(body.article.article_img_url).toBe(requestData.article_img_url);
        expect(body.article.title).toBe(requestData.title);
        expect(typeof body.article.votes).toBe('number');
        expect(body.article.author).toBe(requestData.author);
        expect(typeof body.article.created_at).toBe('string');
        expect(typeof body.article.article_id).toBe('number');
        expect(typeof body.article.comment_count).toBe('number');
        
      });
     })
     test('POST:201 Inserts a new article and responds with the posted article, ignoring additional properties', () => {
      const requestData = {
        author: 'icellusedkars',
        title: 'Z',
        topic: 'mitch',
        body: 'test post',
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        article_id: 1,
      }
      return request(app)
      .post('/api/articles')
      .send(requestData)
      .expect(201)
      .then(({body}) => {
        expect(body.article.body).toBe(requestData.body);
        expect(body.article.topic).toBe(requestData.topic);
        expect(body.article.article_img_url).toBe(requestData.article_img_url);
        expect(body.article.title).toBe(requestData.title);
        expect(typeof body.article.votes).toBe('number');
        expect(body.article.author).toBe(requestData.author);
        expect(typeof body.article.created_at).toBe('string');
        expect(typeof body.article.article_id).toBe('number');
        expect(typeof body.article.comment_count).toBe('number');
        
      });
     })
     test('POST:201 Inserts a new article and responds with the posted article when no article_img_url is provided', () => {
      const requestData = {
        author: 'icellusedkars',
        title: 'Z',
        topic: 'mitch',
        body: 'test post',
      }
      return request(app)
      .post('/api/articles')
      .send(requestData)
      .expect(201)
      .then(({body}) => {
        expect(body.article.body).toBe(requestData.body);
        expect(body.article.topic).toBe(requestData.topic);
        expect(typeof body.article.article_img_url).toBe('string');
        expect(body.article.title).toBe(requestData.title);
        expect(typeof body.article.votes).toBe('number');
        expect(body.article.author).toBe(requestData.author);
        expect(typeof body.article.created_at).toBe('string');
        expect(typeof body.article.article_id).toBe('number');
        expect(typeof body.article.comment_count).toBe('number');
        
      });
     })
     test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no body)', () => {
       return request(app)
         .post("/api/articles")
         .send({
          author: 'icellusedkars',
          title: 'Z',
          topic: 'mitch',
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
         .expect(400)
         .then((response) => {
           expect(response.body.msg).toBe('bad request');
         });
     });
  
     test('POST:404 responds with an appropriate status and error message when given an invalid author(not referenced in users)', () => {
       return request(app)
         .post("/api/articles")
         .send({
            author: 'josh',
            title: 'Z',
            topic: 'mitch',
            body: 'test post',
            article_img_url: 'https://images.pexels.com/photos/158651/  news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
           })
         .expect(404)
         .then((response) => {
           expect(response.body.msg).toBe('not found');
         });
     });
     test('POST:400 responds with an appropriate status and error message when provided an invalid value data-type for title', () => {
      return request(app)
        .post("/api/articles")
        .send({
         author: 'icellusedkars',
         body: "Test post - insightful comment",
         title: 1,
         topic: 'mitch',
         article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test('POST:400 responds with an appropriate status and error message when provided an invalid value data-type for body', () => {
      return request(app)
        .post("/api/articles")
        .send({
         author: 'icellusedkars',
         title: 'Z',
         body: 1,
         topic: 'mitch',
         article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test('POST:400 responds with an appropriate status and error message when provided an invalid value data-type for topic', () => {
      return request(app)
        .post("/api/articles")
        .send({
         author: 'icellusedkars',
         title: 'Z',
         body: "Test post - insightful comment",
         topic: 1,
         article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test('POST:400 responds with an appropriate status and error message when provided an invalid value data-type for article_img_url', () => {
      return request(app)
        .post("/api/articles")
        .send({
         author: 'icellusedkars',
         title: 'Z',
         body: "Test post - insightful comment",
         topic: 'mitch',
         article_img_url: 1
       })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('bad request');
        });
    });
    test("GET:200 sends an array of articles to the client, the amount specified by the limit query", () => {
      return request(app)
        .get("/api/articles?limit=10")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(10);
          body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.total_count).toBe('number')
          });
        });
    });
    test("GET:200 sends an array of articles to the client, with the queries of limit=10 and p=2, it will respond with items 10-20 (second page)", () => {
      return request(app)
        .get("/api/articles?limit=10&p=2")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.total_count).toBe('number')
            expect(body.articles.length).toBe(article.total_count - 10);
          });
        });
    });
    test("GET:200 sends an array of articles to the client, defaulting to a limit of 10 when no query is specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(10)
        });
    });
    test('GET:200 total_count produces the number of articles that match the queries provided, not the total number of all articles', () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].total_count).toBe(14)
        });
    })
    test('GET:404 if you specify a page which suprpasses the total_count, get a response of page not found', () => {
      return request(app)
        .get("/api/articles?limit=10&p=3")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('page not found')
        })
    })
    test('GET:400 if you specify string in the limit query, not a number - appropriate error message in response', () => {
      return request(app)
        .get("/api/articles?limit=ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
    test('GET:400 if you specify string in the p query, not a number - appropriate error message in response', () => {
      return request(app)
        .get("/api/articles?limit=10&p=one")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
    test('GET:400 if you specify limit less than one, responds with appropriate error message', () => {
      return request(app)
        .get("/api/articles?limit=-1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('bad request')
        })
    })
})