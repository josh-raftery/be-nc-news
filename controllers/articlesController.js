const { selectArticles } = require("../models/articlesModel")


function articlesController(request,response,next){
    const {article_id} = request.params
    selectArticles(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {articlesController}