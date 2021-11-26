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
app.use(express.static('assets'))
app.set('view engine', 'ejs') 


//SETEANDO SESIONES
app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
}))

//  ----ENDPOITS---- !!!
app.get("/", (req, res) =>{
    res.render('index')
})

app.get("/fecha", async (req,res) => {

    const tablaClientes = await db.Cliente.findAll({

        order : [
            ['createdAt', 'DESC']
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

app.post("/hardcode" , (req,res) =>{

    const codigo = req.body.codigoelegido
    const equipo = req.body.equipoelegido
    const monto = req.body.montoelegido
    const ganancia = req.body.ganancia_elegida

    console.log("Codigo: ", codigo ,"Equipo: ", equipo, "Monto: ", monto, "Ganancia: ", ganancia)

    res.redirect("/hardcode")


})

app.get("/misapuestas", async (req,res) =>{

    

    const usuarioApuestas = [
        {
            codigo: 1,
            id : '110',
            seleccion: 'Manchester United',
            monto: 20,
            ganancia: 22,
            estado : 1
        },
        {
            codigo: 2,
            id : '111',
            seleccion: 'Villareal',
            monto: 10,
            ganancia: 90,
            estado : 0
        }
    
    ]

    

    res.render('misapuestas', {apuestas: usuarioApuestas})

} )

app.get('/login', (req, res)=> {
    if (req.session.username != undefined) {
        req.session.lastLogin = new Date().getTime()
        res.redirect('/mi_cuenta')
    }else {
        res.render('login')
    }
    
})

app.get('/nosotros', (req, res)=> {
        res.render('nosotros')
})

app.post('/login', async (req, res) => {
    const correo = req.body.correo
    const password = req.body.password

    const cuenta = await db.Cuenta.findOne({
            where : {
                correo : correo,
                pass : password,
            }
        })
    if (cuenta != null){
        
        if (cuenta.estado==1){
            req.session.username = cuenta.correo// guardando variable en sesion
            res.redirect("/mi_cuenta")    
        }
        else{
            console.log("Usuario desactivado. Comuniquese con el administrador")
            res.redirect('/login?aut=2')
        } 
    } else{
        console.log("contraseña o usurio incorrecto")
        res.redirect('/login?aut=1')
    }
        
})

app.get('/mi_cuenta', async (req, res)=> {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin
    const correo = req.session.username

    if (correo == null){
        res.render('login')
    }
    else if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.render('login')
    }else {
        if (correo == "admin"){
            res.render('panel_control')    
        }
        else{
            res.render('mi_cuenta')    
        }     
    }

})

app.get('/mi_cuenta/cerrar', async (req, res)=> {
        req.session.destroy() // Destruyes la sesion
        res.render('index')
})

app.get("/reglas", async (req,res) => {
    res.render('reglas')
})

app.get("/TyC", async (req,res) => {
    res.render('TyC')
})

app.listen(PORT, ()=> {
    console.log(`El servidor se inicio correctamente en el puerto ${PORT}`)
})