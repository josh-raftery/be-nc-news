const { 
    getAllUsers, 
    getUserByUsername 
} = require("../controllers/usersControllers");

const usersRouter = require("express").Router()

usersRouter.get("/", getAllUsers);

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;