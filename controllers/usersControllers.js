const { 
    selectAllUsers, 
    selectUserByUsername, 
    insertUser,
    updateUser
} = require("../models/usersModels")


function getAllUsers(request,response,next){
    selectAllUsers()
    .then((users) => {
        response.status(200).send({users})
    })
}

function postUser(request,response,next){
    const {username,name,avatar_url} = request.body
    insertUser(username,name,avatar_url)
    .then((user) => {
        response.status(201).send({ user });
    })
    .catch((err) => {
        next(err)
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

function patchUser(request,response,next){
    const {username} = request.params
    const{name,avatar_url} = request.body
    updateUser(username,name,avatar_url)
    .then((user) => {
        response.status(200).send({ user });
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    postUser,
    patchUser
}