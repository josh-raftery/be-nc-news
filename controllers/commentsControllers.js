const { selectCommentsByArticleId, insertComment } = require("../models/commentsModels")

function getCommentsByArticleId(request,response,next){
    const {article_id} = request.params
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

function postComment(request,response,next){
    const {body} = request
    const {article_id} = request.params
    insertComment(body,article_id)
    .then((comment) => {
        response.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getCommentsByArticleId,postComment}