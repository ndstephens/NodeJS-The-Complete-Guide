const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const user = process.env.MONGO_LOGIN_NAME
const password = process.env.MONGO_PASSWORD
const dbName = process.env.MONGO_DB_NAME

let _db

const mongoConnect = cb => {
  MongoClient.connect(
    `mongodb+srv://${user}:${password}@${dbName}.mongodb.net/shop?retryWrites=true`,
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log('DB connected...')
      _db = client.db()
      cb()
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'No database found'
}

module.exports = {
  mongoConnect,
  getDb,
}
