const express = require("express");
const { topicsController } = require('../controllers/topicsController.js');
const { getApi } = require("../controllers/apiController.js");
const {getArticlesByIdController, getAllArticles } = require("../controllers/articlesController.js");

const app = express();

app.get('/api/topics',topicsController)

app.get('/api',getApi)

app.get('/api/articles/:article_id',getArticlesByIdController)

app.get('/api/articles',getAllArticles)

app.all('*',(req,response,next) => {
    next({
        status: 404,
        msg: "invalid endpoint"
    })
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