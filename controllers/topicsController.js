const { selectTopics } = require('../models/topicsModel.js')

function topicsController(request,response,next){
    console.log('CONTROLLER')
    selectTopics()
    .then((topics) => {
        response.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
}

module.exports = { topicsController }