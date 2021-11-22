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
const PORT = 8000
//CREANDO APP
const app = express()


//SETEANDO BODYPARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))

//SETENADO TEMPLATES Y VIEWS
app.use('/assets' , express.static('assets'))
app.set('view engine', 'ejs') 


//SETEANDO SESIONES
app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
}))

//  ----ENDPOITS---- !!!
app.get("/",  async (req, res) =>{

    const tablaClientes = await db.Cliente.findAll({
        order : [
            ['id', 'DESC']
        ]
    })

    console.log(tablaClientes)

    res.render('main', { datos : tablaClientes })
})

app.get("/fecha", async (req,res) => {

    const tablaClientes = await db.Cliente.findAll({

        order : [
            ['createdAt', 'ASC']
        ]
    })

    res.render('fechafiltro', { datos : tablaClientes })

})

app.get("/hardcode" , (req,res) =>{

    const partidos = [
        {
            id : '110',
            fecha : '20/02/2021',
            equipo1 : 'Manchester United',
            factor1 : 1.1,
            empate : 4.5,
            equipo2 : 'Alianza Lima',
            factor2 : 9.2
        },
        {
            id : '111',
            fecha : '18/02/2021',
            equipo1 : 'Manchester United',
            factor1 : 1.1,
            empate : 4.5,
            equipo2 : 'Villareal',
            factor2 : 9.2
        },
    ]


    




    res.render('hardcode', { datos : partidos })

} )



app.listen(PORT, ()=> {
    console.log(`El servidor se inicio correctamente en el puerto ${PORT}`)
})