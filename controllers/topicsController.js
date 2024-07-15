const { selectTopics } = require('../models/topicsModel.js')

function topicsController(request,response,next){
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics });
    });
}

module.exports = { topicsController }