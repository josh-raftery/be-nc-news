const db = require("../db/connection.js");
const { checkArticleIdExists } = require("../db/seeds/utils.js");

function selectCommentsByArticleId(article_id,limit = 10,p){

    const offset = limit * (p - 1)

    if(p && !Number(p)){
        return Promise.reject({
            status: 400,
            msg: "bad request"
        })
    }
    if(!Number(limit) || limit <= 0){
        return Promise.reject({
            status: 400,
            msg: "bad request"
        })
    }

    let sqlQueryString =
        `SELECT * 
        FROM comments 
        WHERE article_id=$1
        ORDER BY created_at
        LIMIT ${limit} `

    if(p && p > 1){
        sqlQueryString += `OFFSET ${offset}`
    }
    
    sqlQueryString += `;`

    let articleIdExists = false;

    return db.query(
        `SELECT COUNT(article_id)::INT as count
        FROM comments
        WHERE article_id = $1
        ;`
    ,[article_id])
    .then(({rows}) => {
        if(rows[0].count < offset){
            return Promise.reject({
                status: 404,
                msg: "page not found"
            })
        }
        return checkArticleIdExists(article_id)
    })
    .then((exists) => {
        articleIdExists = exists
        return db.query(sqlQueryString,[article_id])
    })
    .then(({rows}) => {
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

function updateComment(inc_votes,comment_id){
    return db.query(
        `UPDATE comments 
        SET votes = (votes + $1)
        WHERE comment_id = $2
        RETURNING *
        ;`
    ,[inc_votes,comment_id])

    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "comment not found"
            })
        }
        return rows[0]
    })
}

function deleteCommentByArticleId(article_id){
    return db.query(
        `DELETE FROM comments 
        WHERE article_id = $1
        ;`
    ,[article_id])
}

module.exports = {
    selectCommentsByArticleId,
    insertComment,
    deleteComment,
    updateComment,
    deleteCommentByArticleId
}