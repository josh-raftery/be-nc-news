const { getAllArticles, getArticleById, patchArticle, postArticle } = require("../controllers/articlesController")
const { getCommentsByArticleId, postComment } = require("../controllers/commentsControllers")

const articlesRouter = require("express").Router()

articlesRouter.get("/",getAllArticles)
articlesRouter.post("/",postArticle)

articlesRouter.get('/:article_id',getArticleById)
articlesRouter.patch('/:article_id',patchArticle)

articlesRouter.get('/:article_id/comments', getCommentsByArticleId)
articlesRouter.post("/:article_id/comments",postComment)

module.exports = articlesRouter