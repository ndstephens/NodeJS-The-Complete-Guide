// const mysql = require('mysql2')

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: process.env.MYSQL_LOGIN_NAME,
//   database: process.env.MYSQL_DB_NAME,
//   password: process.env.MYSQL_DB_PASSWORD,
// })

// module.exports = pool.promise()

const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_LOGIN_NAME,
  process.env.MYSQL_DB_PASSWORD,
  { dialect: 'mysql', host: 'localhost', operatorsAliases: false }
)

module.exports = sequelize
