const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./dao/models')

const PORT = 5000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static('assets'))
app.set('view engine', 'ejs') 
app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
}))





app.listen(PORT, ()=> {
    console.log(`El servidor se inicio correctamente en el puerto ${PORT}`)
})