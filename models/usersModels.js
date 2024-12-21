const db = require("../connection.js");
const { checkUsernameExists } = require("../db/seeds/utils.js");

function selectAllUsers() {
  return db
    .query(
      `SELECT * 
        FROM users
        ;`
    )
    .then(({ rows }) => {
      return rows;
    });
}

function insertUser(username, name, avatar_url) {
  if (!username || !name || !avatar_url) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }

  let sqlQueryString = `INSERT INTO users `;

  sqlQueryString += `(username,name,avatar_url) 
    VALUES 
    ($1,$2,$3) `;

  sqlQueryString += `RETURNING *;`;

  return checkUsernameExists(username)
    .then((exists) => {
      if (exists) {
        return Promise.reject({
          status: 409,
          msg: "username already exists",
        });
      }
      return db.query(sqlQueryString, [username, name, avatar_url]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

function selectUserByUsername(username) {
  if (Number(username)) {
    return Promise.reject({
      status: 400,
      msg: "bad request",
    });
  }

  return db
    .query(
      `SELECT *
        FROM users 
        WHERE username = $1 
        ;`,
      [username]
    )

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "username not found",
        });
      }
      return rows[0];
    });
}

function updateUser(username,name,avatar_url) {
    if (!username || !name || !avatar_url ) {
        return Promise.reject({
          status: 400,
          msg: "bad request",
        });
      }
    
      return checkUsernameExists(username)
        .then((exists) => {
          if (!exists) {
            return Promise.reject({
              status: 404,
              msg: "user not found",
            });
          }
          return db.query(`
            UPDATE users 
            SET name = $1 , avatar_url = $2 
            WHERE username = $3 
            RETURNING *;`, [name,avatar_url,username]);
        })
        .then(({ rows }) => {
          return rows[0];
        });
}

module.exports = {
  selectAllUsers,
  selectUserByUsername,
  insertUser,
  updateUser,
};
