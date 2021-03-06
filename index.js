//IMPORTS
const { Op } = require("sequelize");
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

const accountSid = 'ACffb76ebd8258ecff9c6f73c5aae03559'; 
const authToken = 'd2a7710820b54fc469a4f44f0457dfb8'; 

const mensajeria = require('twilio')(accountSid,authToken);



//ELIMINAR ARCHIVOS
const fs = require('fs')
//PARA SUBIR ARCHIVOS
const fileUpload = require('express-fileupload')
const path = require('path')
const mimeTypes = require('mime-types')
const { where } = require('sequelize/dist')
const partida = require('./dao/models/partida')

//PUERTO
var PORT = process.env.PORT || 8000
//CREANDO APP
const app = express()


//SETEANDO BODYPARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))

//SETENADO TEMPLATES Y VIEWS
app.use(express.static('assets'))
app.use(fileUpload())
app.set('view engine', 'ejs') 


//SETEANDO SESIONES
app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
}))

app.get('/banner/new', (req, res) => {
    if (req.session.username=="admin"){  
        res.render("banner_new")
    }
    else{
        res.redirect('/advertencia')
    }
})

app.post('/banner/new/upload', async (req, res) => {
    let banner
    let uploadPath

    banner = req.files.banner

    let ext = mimeTypes.extension(banner.mimetype)
    banner.name = Date.now()+ "." + ext
    
    uploadPath = "assets/imagenes/banners/" + banner.name
    const nombre = req.body.nombre
    const urlDestino = req.body.urlDestino

    banner.mv(uploadPath, async (err) => {
        if(err) console.log("hubo un error")
        uploadPath = "/imagenes/banners/" + banner.name
        await db.Banner.create({       
            nombre : nombre,
            urlBanner: uploadPath,
            urlDestino: urlDestino,
            estado:1
        })
    
        res.redirect('/banner')
    })
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

app.post('/banner/modificar/upload', async (req, res) => {
        const idBanner = req.body.id
        const nombre = req.body.nombre
        const urlDestino= req.body.urlDestino

        if(req.body.bannerCheck==null)
            var estado = 0
        else{
            var estado = 1
        }

        var uploadPath = ""
        
        if (req.file == null){
            uploadPath = req.body.urlAnterior
        }
        else{
            let  newBanner = req.files.banner
            let ext = mimeTypes.extension(newBanner.mimetype)
            newBanner.name = Date.now()+ "." + ext 
            uploadPath = "assets/imagenes/banners/" + newBanner.name

            newBanner.mv(uploadPath, async (err) => {
                if(err) console.log("hubo un error")

                uploadPath = "/imagenes/banners/" +  newBanner.name
                
                const banner= await db.Banner.findOne({
                    where : {
                        id : idBanner
                    }
                })

                banner.nombre = nombre
                banner.urlBanner = uploadPath
                banner.urlDestino = urlDestino
                banner.estado = estado
            
                await banner.save()
            
                const path = __dirname +"/assets" + req.body.urlAnterior

                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })

                res.redirect('/banner')
        
            })
            
        }

        const banner= await db.Banner.findOne({
            where : {
                id : idBanner
            }
        })
        banner.nombre = nombre
        banner.urlBanner = uploadPath
        banner.urlDestino = urlDestino
        banner.estado = estado
    
        await banner.save()
        res.redirect('/banner')
}) 

//  ----ENDPOITS---- !!!

app.get("/", async (req, res)  =>{
    const usuario = req.session.username
    const banner = await db.Banner.findAll({
        order : [
            ['id', 'ASC']
        ]
    });
    res.render('index', {
        banner : banner,
        usuario : usuario
    })
})



app.get("/partidos/fecha", async (req,res) => {
    
    console.log("USUARIO: ", req.session.username)
    if (req.session.username!=null){
        
        const idApuesta = new Date().getTime()
        

        const pasadoManana = new Date().getTime() + (86400000 * 2);
        
        
        console.log("PASADO MA??ANA ", pasadoManana)

        console.log("TS ", idApuesta)



        const tablaPartidos = await db.Partida.findAll({


            order : [
                ['fecha', 'ASC']
            ]
            ,
            where: {
                fecha:{
                    
                    $lte: pasadoManana + '00:00:00-05'
                    
                }  
                
                //'2021-01-12 00:00:00-05'
                
            }
            
        })

         res.render('fecha_partidos', {datos: tablaPartidos})



    }else{
        res.redirect('/advertencia')
    }

})

app.get("/pendiente" , async (req,res) =>{
    if (req.session.username!=null){
        const tablaPartidos = await db.Partida.findAll({
    
            where : {
            estado : '1'
            }
        })
    
        res.render('pendiente', {datos : tablaPartidos})

    }else{
        res.redirect('/advertencia')
    }

})
    



app.get("/partidos/:categoria" , async (req,res) =>{

    
    
    let tablaPartidos = await db.Partida.findAll({
        
        order : [
            ['fecha', 'DESC']
        ]
        
    })
    
    if(req.params.categoria != "all"){
        

        //Buscando categor??a: 
       const categoriaJuegoBuscada = await db.CategoriaJuego.findOne({
            
            where :{
                    nombre :  req.params.categoria
                }
        })

        console.log("CATEGOR??A BUSCADA: "+ categoriaJuegoBuscada.id)

        
        const juegoBuscado = await db.Juego.findAll({
            
            where :{
                    categoriaJuegoId :  categoriaJuegoBuscada.id
                }
        })
        
        
        
        let idElegida = 0

        const idLista = []

        juegoBuscado.forEach(i=> {
            console.log("Juego BUSCADO: "+ i.nombre)
            console.log("Juego BUSCADO ID: "+ i.id)
            console.log("CATEGORIA BUSCADO ID: "+ i.categoriaJuegoId)
            idElegida = i.id
            idLista.push(i.id)
            
            
        });
        
        
       
        console.log("LISTA: ", idLista)
            
        
       

        
        tablaPartidos = await db.Partida.findAll({
            
            order : [
                ['fecha', 'DESC']
            ],
            
            where: {
               juego: {
                   [Op.in]: idLista
               }
            
            }
        

        })
    
    }
    
    const tablaCategorias = await db.CategoriaJuego.findAll({
        
    })
    
    res.render('hardcode',
    
    { datos : tablaPartidos, 
        categorias : tablaCategorias, //juegos : tablaJuegos
    })
    
} )


// /:codigo
app.post("/partidos" , async (req,res) =>{

    const idApuesta = new Date().getTime()

    console.log("ID", idApuesta)

    const pasadoManana = new Date().getTime() + (86400000 * 2);

    
    
    let select =  req.body.categoria

    if(select == undefined) {
        select='all'
    }
    
   
    
   
    const usuarioActivo = await db.Cuenta.findOne({
    
        where : {
           correo : req.session.username
        }
    
    })

    //Seleccionar el id del usuario activo
    console.log("ID USUARIO: "+usuarioActivo.id)

    

    const codigo = req.body.codigoelegido
    const equipo = req.body.equipoelegido
    const monto = req.body.montoelegido
    const ganancia = req.body.ganancia_elegida
    
    console.log("Codigo: ", codigo ,"Equipo: ", equipo, "Monto: ", monto, "Ganancia: ", ganancia)

    const factor = ganancia/monto
    
    await db.Apuesta3.create({
        codigoPartida : codigo,
        equipo : equipo,
        monto: monto,
        factor: factor,
        iduUsuario: usuarioActivo.id
    })
    
    res.redirect("/partidos/"+select)
    
    })



app.get("/misapuestas", async (req,res) =>{

    
    //obtener usuario
    const usuarioActivo = await db.Cuenta.findOne({
    
        where : {
           correo : req.session.username
        }
    
    })

    
    const idUsuarioActivo = usuarioActivo.id.toString()
    
    console.log("ID USUARIO: " + idUsuarioActivo)
    
    // Encontrar todas las apuestas del usuario 
    const tablasApuestasUsuario = await db.Apuesta3.findAll({
        where: {
            iduUsuario : idUsuarioActivo
        }
    })
    

    // Encontrar todas las partidas
    const tablaPartidas = await db.Partida.findAll({
        
    })

    var partidas = {}

    tablaPartidas.forEach(partida => {

        partidas[partida.id] = [partida.fecha, partida.equipoA, partida.equipoB, partida.juego, partida.estado, partida.resultado]  

    });

    
    // Crear tabla joineada
    
    const apuestas = []
    tablasApuestasUsuario.forEach(apuesta => {
        
        const apuestaLinea = []
        apuestaLinea.push(apuesta.id)
        apuestaLinea.push(apuesta.codigoPartida)
        apuestaLinea.push(apuesta.equipo)
        apuestaLinea.push(partidas[apuesta.codigoPartida])
        apuestaLinea.push(apuesta.factor)
        apuestaLinea.push(apuesta.monto)
        
        
        

        apuestas.push(apuestaLinea)
    });

    console.log(apuestas)

    res.render('misapuestas', {apuestasUsuario: apuestas})

} )

app.get('/login', (req, res)=> {
    const usuario = req.session.username
    if (req.session.username != undefined) {
        req.session.lastLogin = new Date().getTime()
        res.redirect('/mi_cuenta')
    }else {
        res.render('login',
        {usuario: usuario}
        )
    }
    
})

app.get('/nosotros', (req, res)=> {
    const usuario = req.session.username
        res.render('nosotros',
        {usuario: usuario})

   
    mensajeria.messages 
      .create({ 
         body: 'HOLA! S??CATE TU PRUEBA',  
         messagingServiceSid: 'MG06ac83e44d1d1acf70e08f19c531051a',      
         to: '+51980590096' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
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
        else if(cuenta.correo == "pruebav" && cuenta.pass==password){
            
            if (cuenta.estado==1){
                console.log("Falta validar")
                res.redirect("/sin_validar") 
            } else if (cuenta.estado==2){
                req.session.username = cuenta.correo// guardando variable en sesion
                console.log("Ingreso de prueba")
                res.redirect("/mi_cuenta")           
            } else if (cuenta.estado==0){
                console.log("cuenta inhabilitada")
                res.redirect("/login?aut=2")           
            }
        }
        else if(cuenta.correo == "pruebas" && cuenta.pass==password){
            if (cuenta.estado==1){
                console.log("Falta validar")
                res.redirect("/sin_validar") 
            } else if (cuenta.estado==2){
                req.session.username = cuenta.correo// guardando variable en sesion
                console.log("Ingreso de prueba")
                res.redirect("/mi_cuenta")           
            }
            else if (cuenta.estado==0){
                console.log("cuenta inhabilitada")
                res.redirect("/login?aut=2")           
            }
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
                    console.log("cuenta sin validar")
                    es.redirect("/sin_validar")    
                }
                if (res && cuenta.estado==2){
                    req.session.username = cuenta.correo// guardando variable en sesion
                    console.log("Ingreso a su cuenta")
                    es.redirect("/mi_cuenta")    
                }
            })
            console.log("contrase??a o usuraio incorrecto")
            res.redirect('/login?aut=1')
        }
    }
    else{
        console.log("contrase??a o usuraio incorrecto")
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
        res.render('login' ,{usuario : null})
})

app.get("/reglas", async (req,res) => {
    const usuario = req.session.username
    res.render('reglas',{usuario : usuario})
})

app.get("/TyC", async (req,res) => {
    const usuario = req.session.username
    res.render('TyC', {usuario : usuario})
})

app.get('/juego', async (req, res)=> {
    if (req.session.username=="admin"){
        const juegos = await db.Juego.findAll({
            order : [
                ['id', 'DESC']
            ]
        });

        let nuevaListaJuego = []
        for (let juego of juegos) {
            const categoriaJuego = await juego.getCategoriaJuego()
            nuevaListaJuego.push({
                id : juego.id,
                nombre : juego.nombre,
                categoriaJuegoNombre : categoriaJuego.nombre
            })
        }
        console.log("lista", nuevaListaJuego)

        res.render('juego', {
            juegos : nuevaListaJuego
        })
    }else{
        res.redirect('/advertencia')
    }  

})

app.get('/juego/new', async (req, res) => {
    if (req.session.username=="admin"){
        const categoriaJuego = await db.CategoriaJuego.findAll()
        res.render('juego_new', {
            categoriaJuego : categoriaJuego
        })
    }
    else{
        res.redirect('/advertencia')
    }
    
})

app.post('/juego/new', async (req, res) => {
    
    const nombre = req.body.nombre
    const categoriaId = req.body.juego_categoriaJuegoId

    await db.Juego.create({
        nombre : nombre,
        categoriaJuegoId : categoriaId
    })

    res.redirect('/juego')
})

app.get('/juego/modificar/:codigo', async (req, res) => {
    
    if (req.session.username=="admin"){
        const idJuego = req.params.codigo
        const juego = await db.Juego.findOne({
            where : {
                id : idJuego
            }
        })
    
        const categoriaJuego = await db.CategoriaJuego.findAll()
        res.render('juego_update', {
            juego : juego,
            categoriaJuego : categoriaJuego
        })

    }else{
        res.redirect('/advertencia')
    }
    
})

app.post('/juego/modificar', async (req, res) => {
    const idJuego= req.body.id
    const nombre =req.body.nombre
    const categoriaJuegoId = req.body.juegoCategoriaJuegoId

    console.log(categoriaJuegoId)

    const juego = await db.Juego.findOne({
        where : {
            id : idJuego
        }
    })

    //2. Cambiar su propiedas / campos
    juego.nombre = nombre
    juego.categoriaJuegoId = categoriaJuegoId

    //3. Guardo/Actualizo en la base de datos
    await juego.save()

    res.redirect('/juego')

})

app.get('/juego/eliminar/:codigo', async (req, res) => {
    const idJuego = req.params.codigo
    await db.Juego.destroy({
        where : {
            id : idJuego
        }
    })
    res.redirect('/juego')
})

app.get('/partida', async (req, res)=> {
    if (req.session.username=="admin"){
        const partidas = await db.Partida.findAll({
            order : [
                ['fecha', 'ASC']
            ]
        });
    
        let nuevaListaPartida = []
        for (let partida of partidas) {
            const juego = await partida.getJuego()
            const estado = await partida.getEstadoPartida()
               nuevaListaPartida.push({
                id : partida.id,
                juego : juego.nombre,
                fecha : partida.fecha,
                equipoA : partida.equipoA,
                equipoB : partida.equipoB,
                estado : estado.nombre
            })
        }
        console.log("lista", nuevaListaPartida)
    
        res.render('partida', {
            partidas : nuevaListaPartida
        })

    }else{
        res.redirect('/advertencia')
    }  

})

app.get('/partida/new', async (req, res) => {
    if (req.session.username=="admin"){
        const nombreJuego = await db.Juego.findAll()
        const estadosPartida = await db.EstadoPartida.findAll()
        res.render('partida_new', {
            nombreJuego : nombreJuego,
            estadosPartida : estadosPartida
        })
    }
    else{
        res.redirect('/advertencia')
    }
    
})

app.post('/partida/new', async (req, res) => {
    
    const juego = req.body.partida_juego
    const partida_fecha = req.body.partida_fecha
    const partida_duracion = req.body.partida_duracion
    const partida_equipoA = req.body.partida_equipoA
    const partida_equipoB = req.body.partida_equipoB
    const partida_estado = req.body.partida_estado

    await db.Partida.create({
        juego : juego,
        fecha : partida_fecha,
        duracion : partida_duracion,
        equipoA : partida_equipoA,
        equipoB : partida_equipoB,
        estado : partida_estado
    })

    res.redirect('/partida')
})

app.get('/partida/modificar/:codigo', async (req, res) => {
    if (req.session.username=="admin"){
        const idPartida = req.params.codigo
        const partida = await db.Partida.findOne({
            where : {
                id : idPartida
            }
        })
    
        const nombreJuego = await db.Juego.findAll()
        const estadosPartida = await db.EstadoPartida.findAll()
        const resultadoPartida = await db.Resultado.findAll()
    
        res.render('partida_update', {
            partida : partida,
            nombreJuego : nombreJuego,
            estadosPartida : estadosPartida,
            resultadoPartida : resultadoPartida
        })
    }else{
        res.redirect('/advertencia')
    }
})

app.post('/partida/modificar', async (req, res) => {
    const idPartida= req.body.partida_id
    const juego = req.body.partida_juego
    const fecha = req.body.partida_fecha
    const equipoA = req.body.partida_equipoA
    const equipoB = req.body.partida_equipoB
    const factorA = req.body.partida_factorA
    const factorB = req.body.partida_factorB
    const factorE = req.body.partida_factorE
    const estado = req.body.partida_estado
    const resultado = req.body.partida_resultado

    console.log(juego)

    const partida = await db.Partida.findOne({
        where : {
            id : idPartida
        }
    })
    //2. Cambiar su propiedas / campos
    partida.juego = juego
    partida.fecha = fecha
    partida.equipoA = equipoA
    partida.equipoB = equipoB
    partida.estado = estado
    partida.resultado = resultado
    partida.factorA = factorA
    partida.factorB = factorB
    partida.factorE = factorE

    //3. Guardo/Actualizo en la base de datos
    await partida.save()

    res.redirect('/partida')

})

app.get('/partida/eliminar/:codigo', async (req, res) => {
    const idPartida = req.params.codigo
    await db.Partida.destroy({
        where : {
            id : idPartida
        }
    })
    res.redirect('/partida')
})






app.get("/registro_1", (req,res) => {
    res.render('registro_1')
})









app.get("/registro_2", (req,res) => {
    res.render('registro_2')
})






app.get("/registro_3", (req,res) => {
    res.render('registro_3')
})






app.get("/registro_4", (req,res) => {
    res.render('registro_4')
})




app.get("/registro_5", (req,res) => {
    res.render('registro_5')
})





app.get("/registro_exitoso", (req,res) => {
    res.render('registro_exitoso')
})


app.get("/sin_validar", async (req,res) => {
    res.render('sin_validacion')
})


app.get("/advertencia", async (req,res) => {
    res.render('advertencia')
})


app.get("/categoria", async (req,res) => {
    if (req.session.username=="admin"){
        const categoria = await db.CategoriaJuego.findAll({
                order : [
                    ['id', 'DESC']
                ]
            });
            res.render('categoria', {
                categorias : categoria
            })
    }
    else{
        res.redirect('/advertencia')
    }
   
})


app.get("/categoria_new", async (req,res) => {
    res.render('categoria_new')
})

app.get('/categoria/new', async (req, res) => {
    if (req.session.username=="admin"){
        const nombrecategoria = await db.CategoriaJuego.findAll()
      
        res.render('categoria_new', {
            nombrecategoria : nombrecategoria,
        })
    }
    else{
        res.redirect('/advertencia')
    }
    
})

app.post('/categoria/new', async (req, res) => {
    
    const nombre = req.body.nombre
   

    await db.CategoriaJuego.create({
        nombre : nombre
    })

    res.redirect('/categoria')
})




app.get("/categoria_update", async (req,res) => {
    res.render('categoria_update')
})




//editar categoria
app.get('/categoria/modificar/:codigo', async (req, res) => {
    if (req.session.username=="admin"){
        const idcategoria = req.params.codigo
        const categoria = await db.CategoriaJuego.findOne({
            where : {
                id : idcategoria
            }
        })
    
        res.render('categoria_update', {
          categoria:categoria
        })
    }else{
        res.redirect('/advertencia')
    }
})

app.post('/categoria/modificar', async (req, res) => {
    const idcategoria= req.body.id
    const nombre =req.body.nombre
 

    const categoria = await db.CategoriaJuego.findOne({
        where : {
            id : idcategoria
        }
    })
    //2. Cambiar su propiedas / campos
    categoria.nombre = nombre
   

    //3. Guardo/Actualizo en la base de datos
    await categoria.save()

    res.redirect('/categoria')  
})



app.get('/categoria/eliminar/:codigo', async (req, res) => {
    const idcategoria = req.params.codigo
    await db.CategoriaJuego.destroy({
        where : {
            id : idcategoria
        }
    })
    res.redirect('/categoria')
})







    

app.listen(PORT, ()=> {
    console.log(`El servidor se inicio correctamente en el puerto ${PORT}`)
})