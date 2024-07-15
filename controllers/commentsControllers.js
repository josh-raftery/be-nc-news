const { selectCommentsByArticleId } = require("../models/commentsModels")

function getCommentsByArticleIdController(request,response,next){
    const {article_id} = request.params
    selectCommentsByArticleId(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
}

module.exports = {getCommentsByArticleIdController}