const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const user = process.env.MONGO_LOGIN_NAME
const password = process.env.MONGO_PASSWORD
const dbName = process.env.MONGO_DB_NAME

const mongoConnect = cb => {
  MongoClient.connect(
    `mongodb+srv://${user}:${password}@${dbName}.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true }
  )
    .then(() => {
      console.log('DB connected...')
      cb()
    })
    .catch(err => console.log(err))
}

module.exports = mongoConnect
