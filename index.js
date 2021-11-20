//IMPORTS

//EXPRESS
const express = require('express')
//BODYPARSER
const bodyParser = require('body-parser')
//SESIONES
const session = require('express-session')
//BASE DE DATOS
const db = require('./dao/models')
const { application } = require('express')


//PUERTO
const PORT = 5000
//CREANDO APP
const app = express()


//SETEANDO BODYPARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))

//SETENADO TEMPLATES Y VIEWS
app.use(express.static('assets'))
app.set('view engine', 'ejs') 


//SETEANDO SESIONES
app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
}))

//  ----ENDPOITS---- !!!
app.get("/", async (req, res) =>{

    const tablaClientes = await db.Cliente.findAll({
        order : [
            ['id', 'DESC']
        ]
    })

    console.log(tablaClientes)

    res.render('index')
})




app.listen(PORT, ()=> {
    console.log(`El servidor se inicio correctamente en el puerto ${PORT}`)
})