const express = require("express");
const { topicsController } = require('../controllers/topicsController.js');
const { getApi } = require("../controllers/apiController.js");
const {getArticleById, getAllArticles, patchArticle} = require("../controllers/articlesController.js");
const { getCommentsByArticleId, postComment } = require("../controllers/commentsControllers.js");

const app = express();
app.use(express.json());

app.get('/api/topics',topicsController)

app.get('/api',getApi)

app.get('/api/articles/:article_id',getArticleById)
app.patch('/api/articles/:article_id',patchArticle)

app.get('/api/articles',getAllArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post("/api/articles/:article_id/comments",postComment)

app.all('*',(req,response,next) => {
    next({
        status: 404,
        msg: "invalid endpoint"
    })
});

app.use((err, req, res, next) => {
    if (err.code === '23503') {
      res.status(400).send({ msg: 'foreign key violation' });
    }
    next(err);
});

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'bad request' });
    }
    next(err);
});


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
    next(err);
});

app.use((err, req, res, next) => {
    if(err){
        res.status(500).send({ msg: "Internal Server Error" });
    }
    next(err)
});


module.exports = app