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
//PARA ENCRIPTAR
const bcrypt = require('bcrypt')

//ELIMINAR ARCHIVOS
const fs = require('fs')
//PARA SUBIR ARCHIVOS
const multer = require('multer')
const mimeTypes = require('mime-types')

const storageBanner= multer.diskStorage({
    destination: "assets/imagenes/banners/",
    filename: function(req,file,cb){
        cb("",Date.now()+ "." + mimeTypes.extension(file.mimetype))
    }
})

const uploadBanner = multer({
    storage: storageBanner
})

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

app.post("/hardcode" , (req,res) =>{

    const div = req.body.equipoelegido

    console.log("Equipo: ",div)


})

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
                correo : correo
            }
        })
    
    if (cuenta != null){
        //Usuario admin sin encriptacion
        if(cuenta.correo == "admin" && cuenta.pass==password){
            req.session.username = cuenta.correo// guardando variable en sesion
            console.log("Ingreso de admin")
            res.redirect("/mi_cuenta")         
        }
        //Usuario cliente sin encriptacion para pruebas
        else if(cuenta.correo == "prueba" && cuenta.pass==password){
            req.session.username = cuenta.correo// guardando variable en sesion
            console.log("Ingreso de prueba")
            res.redirect("/mi_cuenta")         
        }
        else{
            bcrypt.compare(password,cuenta.pass,(err,res) => {
                if(err){
                    console.log("error")
                    res.redirect('/login?aut=1')
                }
                if (res && cuenta.estado==0){
                    console.log("Usuario desactivado. Comuniquese con el administrador")
                    res.redirect('/login?aut=2')
                }
                if (res && cuenta.estado==1){
                    req.session.username = cuenta.correo// guardando variable en sesion
                    console.log("Ingreso a su cuenta")
                    es.redirect("/mi_cuenta")    
                }
            })
            console.log("contraseña o usuraio incorrecto")
            res.redirect('/login?aut=1')
        }
    }
    else{
        console.log("contraseña o usuraio incorrecto")
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

app.get('/banner/new', async (req, res) => {
    if (req.session.username=="admin"){
        res.sendFile(__dirname + "/views/banner_new.ejs")
        res.render('banner_new')
    }
    else{
        res.render('/advertencia')
    }
    
})

app.post('/banner/new/upload',uploadBanner.single("banner"), async (req, res) => {
    const filepath = `/imagenes/banners/${req.file.filename}`
    const nombre = req.body.nombre

    await db.Banner.create({
        nombre : nombre,
        urlBanner: filepath,
        estado:1
    })

    res.redirect('/banner')
})

app.get('/banner', async (req, res)=> {
    if (req.session.username=="admin"){
        const banner = await db.Banner.findAll({
                order : [
                    ['id', 'DESC']
                ]
            });
            res.render('banner', {
                banner : banner
            })
    }
    else{
        res.redirect('/advertencia')
    }
})



app.get('/banner/eliminar/:codigo', async (req, res) => {
    if (req.session.username=="admin"){
        const idBanner = req.params.codigo
        const banner = await db.Banner.findOne({
            where : {
                id : idBanner
            }
        })
    
        const path = __dirname +"/assets" + banner.urlBanner
        
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
    
        await db.Banner.destroy({
            where : {
                id : idBanner
            }
        })
    
        res.redirect('/banner')
    }
    else{
        res.redirect('/advertencia')
    }
})

app.get('/banner/modificar/:codigo', async (req, res) => {
    if (req.session.username=="admin"){
        const idBanner = req.params.codigo
        const banner = await db.Banner.findOne({
            where : {
                id : idBanner
            }
        })
        res.render('banner_update', {
            banner : banner
        })    
    } else{
        res.redirect('/advertencia')
    } 
})


app.post('/banner/modificar/upload',uploadBanner.single("banner"), async (req, res) => {
        const idBanner = req.body.id
        const nombre =req.body.nombre
        var filepath = ""
        if (req.file == null){
            filepath = req.body.urlAnterior
        }
        else{
            filepath = `/imagenes/banners/${req.file.filename}`
            
            const path = __dirname +"/assets" + req.body.urlAnterior
            
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
        const estado = req.body.estado
        const banner= await db.Banner.findOne({
            where : {
                id : idBanner
            }
        })
        banner.nombre = nombre
        banner.urlBanner = filepath
        banner.estado = estado
    
        await banner.save()
        res.redirect('/banner')
})

app.listen(PORT, ()=> {
    console.log(`El servidor se inicio correctamente en el puerto ${PORT}`)
})