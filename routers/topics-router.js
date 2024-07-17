const { topicsController } = require("../controllers/topicsController")
const topicsRouter = require("express").Router()

topicsRouter.get('/',topicsController)

module.exports = topicsRouter