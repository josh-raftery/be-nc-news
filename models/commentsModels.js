const db = require("../db/connection.js");
const { checkArticleIdExists } = require("../db/seeds/utils.js");

function selectCommentsByArticleId(article_id){
    const promisesArray = []
    promisesArray.push(db.query(
        `SELECT * 
        FROM comments 
        WHERE article_id=$1
        ORDER BY created_at
        ;`
    ,[article_id]))

    promisesArray.push(checkArticleIdExists(article_id))

    return Promise.all(promisesArray)
    .then(([{rows}, articleIdExists]) => {
        if(rows.length === 0 && !articleIdExists){
            return Promise.reject({
                status: 404,
                msg: "comments not found"
            })
        }
        return rows
    })
}

module.exports = {selectCommentsByArticleId}