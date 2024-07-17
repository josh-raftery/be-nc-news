const { getAllUsers } = require("../controllers/usersControllers");
const usersRouter = require("express").Router()

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;