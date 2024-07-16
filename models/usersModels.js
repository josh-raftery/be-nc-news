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

module.exports = {selectAllUsers}