const { removeComment } = require("../controllers/commentsControllers")
const commentsRouter = require("express").Router()

commentsRouter.delete('/:comment_id',removeComment)

module.exports = commentsRouter