const { getTopics, postTopics } = require("../controllers/topicsController")
const topicsRouter = require("express").Router()

topicsRouter.get('/',getTopics)
topicsRouter.post('/',postTopics)

module.exports = topicsRouter