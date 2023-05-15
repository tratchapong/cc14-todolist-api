require('dotenv').config()
const express = require('express')
const notFound = require('./middlewares/notFound')
const errorHdl = require('./middlewares/errorHdl')
const authRoute = require('./routes/authRoute')

const app = express()

app.use(express.json())

app.use('/auth', authRoute )

app.use(notFound)

app.use(errorHdl)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log("Server run on", port))