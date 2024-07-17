const db = require("../db/connection.js");

function selectAllUsers(){
    return db.query(
        `SELECT * 
        FROM users
        ;`
    )
    .then(({rows}) => {
        return rows
    })
}

function selectUserByUsername(username){
    if(Number(username)){
        return Promise.reject({
            status: 400,
            msg: "bad request"
        })
    }

    return db.query(
        `SELECT *
        FROM users 
        WHERE username = $1 
        ;`
    ,[username])

    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "username not found"
            })
        }
        return rows[0]
    })

}

module.exports = {selectAllUsers,selectUserByUsername}