const endpoints = require('../endpoints.json')

function getApi(request,response,next){
    response.status(200).send({endpoints})
}

module.exports = {getApi}