const { selectArticlesById, selectAllArticles, updateArticle} = require("../models/articlesModel")

function getArticleById(request,response,next){
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
}

function patchArticle(request,response,next){
    const {inc_votes} = request.body
    const {article_id} = request.params
    updateArticle(inc_votes,article_id)
    .then((article) => {
        response.status(200).send({article}) 
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getArticleById,getAllArticles,patchArticle}