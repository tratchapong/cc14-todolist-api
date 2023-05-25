require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const notFound = require('./middlewares/notFound')
const error = require('./middlewares/error')
const authenticate = require('./middlewares/authenticate')
const todoRoute = require('./routes/todoRoute')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const app = express()

// app.use(morgan('dev'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] \n :body '));


app.use('/pic',express.static('pic'))
app.use(cors())
app.use(express.json()) 

app.use('/auth', authRoute)
app.use('/user', authenticate, userRoute)
app.use('/todos',authenticate, todoRoute)

app.use(notFound)
app.use(error)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on port', port))