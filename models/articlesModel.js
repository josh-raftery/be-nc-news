const db = require("../db/connection.js");
const { checkArticleIdExists } = require("../db/seeds/utils.js");
const { deleteCommentByArticleId } = require("./commentsModels.js");

function selectArticlesById(article_id){
    return db.query( 
        `SELECT articles.*,
        COUNT(comments.article_id)::INT AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id 
        ;`
    ,[article_id])

    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "article not found"
            })
        }
        return rows[0]
    })
}

function selectAllArticles(sort_by = 'created_at',order = 'DESC',limit = 10, p,topic,title){ 

    if(Number(topic)){
        return Promise.reject({
            status: 400,
            msg: "bad request"
        })
    }

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

    const validSort = ['title','author','article_id','topic','created_at','votes','article_img_url','comment_count']
    const validOrder = ['asc','desc','ASC','DESC']

    if(!validSort.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({
            status: 404,
            msg: "not found"
        })
    }

    let sqlQueryString = 
    `SELECT articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url, 
    COUNT(comments.article_id)::INT AS comment_count 
    FROM articles  LEFT JOIN comments
    ON comments.article_id = articles.article_id `

    const topicArray = []
    const whereArr = []
    let queries = ''

    if(topic){
        whereArr.push(`topic = $1 `)
        topicArray.push(topic)
    }

    if(title){
        whereArr.push(`title LIKE ${topic ? '$2' : '$1'} `)
        topicArray.push(`%${title}%`)
    }

    if(whereArr.length > 0){
        queries = `
        WHERE ${whereArr.join('AND ')} 
        `
        sqlQueryString += queries
    }

    sqlQueryString += 
    `GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    LIMIT ${limit}`

    if(p && p > 1){
        const offset = limit * (p - 1)
        sqlQueryString += ` OFFSET ${offset}`
    }
    
    sqlQueryString += `;`
    let count = 0

    console.log(sqlQueryString)

    let countQueryString = 
    `SELECT COUNT(article_id)::INT AS count FROM articles`

    countQueryString += queries

    countQueryString += `;`
    console.log('before promse')
    return db.query(countQueryString,topicArray)
    .then(({rows}) => {
        console.log(rows)
        count = rows[0].count
        return db.query(sqlQueryString,topicArray)
    })
    .then(({rows}) => {
        console.log(rows)
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "page not found"
            })
        }
        return rows.map((row) => {
            row.total_count = count
            return row
        })
    })
  
}

function updateArticle(inc_votes,article_id){
    return db.query( 
        `UPDATE articles 
        SET votes = (votes + $1)
        WHERE article_id = $2
        RETURNING *
        ;`
    ,[inc_votes,article_id])

    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "article not found"
            })
        }
        return rows[0]
    })
}

function insertArticle(requestBody,author,title,body,topic,article_img_url){

    if(!author || !title || !body || !topic){
        return Promise.reject({
            status: 400,
            msg: "bad request"
        })
    }

    const columnsToCheck = ['author','title','body','topic','article_img_url']
    let number = false

    columnsToCheck.forEach((column) => {
        if(Number(requestBody[column])){
            number = true   
        }
    })

    if(number){
        return Promise.reject({
            status: 400,
            msg: "bad request"
        })
    }

    const values = [author,title,body,topic]
    const output = []

    let sqlQueryString = `INSERT INTO articles `
    

    if(article_img_url){
        sqlQueryString += 
        `(author,title,body,topic,article_img_url) 
        VALUES 
        ($1,$2,$3,$4,$5) ` 
        values.push(article_img_url)
    }else{
        sqlQueryString += 
        `(author,title,body,topic) 
        VALUES 
        ($1,$2,$3,$4) `
    }

    sqlQueryString +=   `RETURNING *;`

    return db.query(sqlQueryString,values)
    .then(({rows}) => {
        output.push(rows[0])
        return db.query(
            `SELECT
            COUNT(comments.article_id)::INT AS comment_count 
            FROM articles
            LEFT JOIN comments
            ON comments.article_id = articles.article_id
            WHERE articles.article_id = $1 
            GROUP BY articles.article_id 
        ;`
        ,[rows[0].article_id])
    })
    .then(({rows}) => {
        output[0].comment_count = rows[0].comment_count
        return output[0]
    })
}

function deleteArticle(article_id){
    return checkArticleIdExists(article_id)
    .then((exists) => {
        if(!exists){
            return Promise.reject({
                status: 404,
                msg: "article not found"
            })
        }
        return deleteCommentByArticleId(article_id)
    })
    .then(() => {
        return db.query(
            `DELETE FROM articles 
            WHERE article_id = $1
            ;`
        ,[article_id])
    })
}

module.exports = {
    selectAllArticles,
    selectArticlesById,
    updateArticle,
    insertArticle,
    deleteArticle
}