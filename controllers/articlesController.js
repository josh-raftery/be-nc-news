const { selectArticlesById, selectAllArticles} = require("../models/articlesModel")

function getArticlesByIdController(request,response,next){
    const {article_id} = request.params
    selectArticlesById(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

function getAllArticles(request,response,next){
    selectAllArticles()
    .then((articles) => {
        response.status(200).send({articles}) 
    })
    .catch((err) => {
    })
}

module.exports = {getArticlesByIdController,getAllArticles}