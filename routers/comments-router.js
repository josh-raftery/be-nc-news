const { removeComment, patchComment } = require("../controllers/commentsControllers")
const commentsRouter = require("express").Router()

commentsRouter.delete('/:comment_id',removeComment)
commentsRouter.patch('/:comment_id',patchComment)

module.exports = commentsRouter