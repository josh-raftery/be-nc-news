const db = require("../db/connection.js");

function selectTopics(){
    return db.query(
        `SELECT *
        FROM topics;`
    )
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { selectTopics }