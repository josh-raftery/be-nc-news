const express = require("express");
const { topicsController } = require('../controllers/topicsController.js')

const app = express();

app.get('/api/topics',topicsController)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
    next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app