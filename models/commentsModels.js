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

function insertComment(request,article_id){
    const {body,author} = request

    if(!body || !author){
        return Promise.reject({ status: 400, msg: "bad request" });
    }

    return checkArticleIdExists(article_id)
    .then((exists) => {
        if(!exists){
            return Promise.reject({
                status: 404,
                msg: "article not found"
            })
        }
        return db.query(
            `INSERT INTO comments 
            (body,author,article_id)
            VALUES
            ($1,$2,$3)
            RETURNING *
            ;`
        ,[body,author,article_id])
    })
    .then(({rows}) => {
        return rows[0]
    })
}

function deleteComment(comment_id){
    return db.query(
        `DELETE FROM comments 
        WHERE comment_id = $1
        RETURNING *
        ;`
    ,[comment_id])
    .then(({rowCount}) => {
        if(rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: "comment not found"
            })
        }
    })
}

module.exports = {selectCommentsByArticleId,insertComment,deleteComment}