const { 
    getAllUsers, 
    getUserByUsername, 
    postUser,
    patchUser
} = require("../controllers/usersControllers");

const usersRouter = require("express").Router()

usersRouter.get("/", getAllUsers);
usersRouter.post('/', postUser)

usersRouter.get("/:username", getUserByUsername);
usersRouter.patch('/:username', patchUser)



module.exports = usersRouter;