const { selectAllUsers, selectUserByUsername } = require("../models/usersModels")


function getAllUsers(request,response,next){
    selectAllUsers()
    .then((users) => {
        response.status(200).send({users})
    })
}

function getUserByUsername(request,response,next){
    const {username} = request.params
    selectUserByUsername(username)
    .then((user) => {
        response.status(200).send({user})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllUsers,getUserByUsername}