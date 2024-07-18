const { selectArticlesById, selectAllArticles, updateArticle, insertArticle} = require("../models/articlesModel")

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
    const {query} = request
    const {sort_by} = request.query
    const {order} = request.query

    selectAllArticles(query,sort_by,order)
    .then((articles) => {
        response.status(200).send({articles}) 
    })
    .catch((err) => {
        next(err)
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

function postArticle(request,response,next){
    const requestBody = request.body
    const {author,title,body,topic,article_img_url} = requestBody
    insertArticle(requestBody,author,title,body,topic,article_img_url)
    .then((article) => {
        response.status(201).send({article}) 
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getArticleById,getAllArticles,patchArticle,postArticle}