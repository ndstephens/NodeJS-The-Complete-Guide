const express = require('express')

// INIT APP
const app = express()
const port = process.env.PORT || 3000

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }))

// ROUTES
app.get('/add-product', (req, res, next) => {
  res.send(
    `<form action="/product" method="post"><input type="text" name="title"><button type="submit">Submit</button></form>`
  )
})

app.post('/product', (req, res, next) => {
  console.log(req.body)
  res.redirect('/')
})

app.use('/', (req, res, next) => {
  res.send(`<h1>Hello from Express</h1>`)
})

// RUN SERVER
app.listen(port)
