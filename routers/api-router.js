const { getApi } = require("../controllers/apiController");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const apiRouter = require("express").Router();

apiRouter.get("/",getApi)

apiRouter.use('/users',usersRouter)

apiRouter.use('/articles',articlesRouter)

apiRouter.use('/topics',topicsRouter)

apiRouter.use('/comments',commentsRouter)

module.exports = apiRouter