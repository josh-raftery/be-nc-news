const express = require("express");

const app = express();
app.use(express.json());

const apiRouter = require("./routers/api-router");

app.use("/api", apiRouter);

app.all('*',(req,response,next) => {
    next({
        status: 404,
        msg: "invalid endpoint"
    })
});

app.use((err, req, res, next) => {
    if (err.code === '23503') {
      res.status(404).send({ msg: 'not found' });
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