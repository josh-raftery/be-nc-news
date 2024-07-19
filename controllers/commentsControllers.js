const { selectCommentsByArticleId, insertComment, deleteComment, updateComment } = require("../models/commentsModels")

function getCommentsByArticleId(request,response,next){
    const {article_id} = request.params
    const {limit,p} = request.query
    selectCommentsByArticleId(article_id,limit,p)
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

function removeComment(request,response,next){
    const {comment_id} = request.params
    deleteComment(comment_id)
    .then(() => {
       response.sendStatus(204)
    })
    .catch((err) => {
        next(err)
    })
}

function patchComment(request,response,next){
    const {inc_votes} = request.body
    const {comment_id} = request.params
    updateComment(inc_votes,comment_id)
    .then((comment) => {
        response.status(200).send({comment})
     })
     .catch((err) => {
        next(err)
     })
}

module.exports = {getCommentsByArticleId,postComment,removeComment,patchComment}