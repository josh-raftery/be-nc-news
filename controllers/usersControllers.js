const { selectAllUsers } = require("../models/usersModels")


function getAllUsers(request,response,next){
    selectAllUsers()
    .then((users) => {
        response.status(200).send({users})
    })
}

module.exports = {getAllUsers}