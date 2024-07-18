const db = require("../db/connection.js");

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

function selectAllArticles(query,sort_by = 'created_at',order = 'DESC'){

    for(let key in query){
        if(key != 'sort_by' && key != 'order'){
            return Promise.reject({
                status: 400,
                msg: "bad request"
            })
        }
    }

    const validSort = ['title','author','article_id','topic','created_at','votes','article_img_url','comment_count']
    const validOrder = ['asc','desc','ASC','DESC']
    
    if(!validSort.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({
            status: 404,
            msg: "not found"
        })
    }
  
    return db.query(
        `SELECT articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url, 
        COUNT(comments.article_id)::INT AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id 
        ORDER BY ${sort_by} ${order}
        ;`
    )
    .then(({rows}) => {
        return rows
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

module.exports = {selectAllArticles,selectArticlesById,updateArticle,insertArticle}