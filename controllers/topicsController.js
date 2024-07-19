const { selectTopics, insertTopic } = require('../models/topicsModel.js')

function getTopics(request,response,next){
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics });
    });
}

function postTopics(request,response,next){
    const {slug,description} = request.body
    insertTopic(slug,description)
    .then((topic) => {
        response.status(201).send({ topic });
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics,postTopics }