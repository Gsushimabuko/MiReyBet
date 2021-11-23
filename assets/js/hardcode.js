

let cartilla = false
let total = 0
let intentos = 0
let vacio = false

const inputTotal = document.getElementById("total")
const longitud = document.getElementById("tabla").childElementCount
const inicio = 110




const obtenerFactores = () =>{

    for (let i = inicio; i < inicio+longitud; i++) {

        const butlocal = document.getElementById("butlocal" + i)
        const butvisita = document.getElementById("butvisita" + i)
        const butempate = document.getElementById("butempate" + i)
        

        butlocal.onclick = () =>{
            
            if(butlocal.className == "seleccion"){
                console.log("comprobando")
                butlocal.setAttribute("class", "")
            }else{
                
                butlocal.setAttribute("class", "seleccion")
            }

            const factorlocal = butlocal.innerText
            crearCartilla(factorlocal,butlocal.id,i)
            
            
            
        }
        
        butempate.onclick = () =>{

            if(butempate.className == "seleccion"){
                console.log("comprobando")
                butempate.setAttribute("class", "")
            }else{
                
                butempate.setAttribute("class", "seleccion")
            }
            
            const factorempate = butempate.innerText
            crearCartilla(factorempate,butempate.id,i)
            
        }
        
        butvisita.onclick = () =>{
            
            if(butvisita.className == "seleccion"){
                console.log("comprobando")
                butvisita.setAttribute("class", "")
            }else{
                
                butvisita.setAttribute("class", "seleccion")
            }
            const factorvisita = butvisita.innerText
            crearCartilla(factorvisita,butvisita.id,i)
            
            
            

        }
        
    }
    
    
    
} 



const crearCartilla = (factor,idBoton,idLinea) =>{
    
    //ACCEDIENDO AL DIV VACÍO DE LA CARTILLA
    const divCartilla = document.getElementById("cartilla")
    const divMultiplicador = document.getElementById("multiplicador")


    if(cartilla == false) {

        

        //nombre del equipo Local
        const nombreLocal = document.getElementById(idLinea).children[2].children[0].innerText
        
        
        //nombre visita
        const nombreVisita = document.getElementById(idLinea).children[4].children[0].innerText
        

        console.log("PARTIDO: ", nombreLocal, " vs ", nombreVisita)

        //Texto partido
        const textoPartido = idLinea + " " + nombreLocal + " vs " + nombreVisita + "\n"
        const textoPartidoHTML = document.createElement("text")
        textoPartidoHTML.innerText = textoPartido

        //CODIGO PARTIDA
        const codigopartida = document.createElement("input")
        codigopartida.setAttribute("id", "codigoPartidaFinal")
        codigopartida.setAttribute("type","hidden")
        codigopartida.value = idLinea
        
    
        //ACCEDIENDO AL NOMBRE DEL EQUIPO DEL FACTOR
        const nombreEquipo = document.getElementById(idBoton).parentNode.previousElementSibling.innerText
        const nombreHTML = document.createElement("div")
        nombreHTML.setAttribute("id","nombreseleccion")
        nombreHTML.innerText = nombreEquipo
        //CREANDO EL TEXTO CON EL NUMERO  DEL FACTOR
        const factorApuesta = document.createTextNode(factor)
        
    
        
        console.log(nombreEquipo, factorApuesta)
    
        //AGREGANDO EL FACTOR
        divCartilla.appendChild(codigopartida)
        divCartilla.appendChild(textoPartidoHTML)
        divCartilla.appendChild(nombreHTML)
        divMultiplicador.appendChild(factorApuesta)

        //Agregar Botón cerrar
        agregarBotonCerrar()

        cartilla = true
        actualizarGanancia()
        confirmarApuesta()



    }else{

        divCartilla.innerHTML = ""
        divMultiplicador.innerHTML = ""

       
        
        const divCerrar = document.getElementById("cerrar")   
        divCerrar.removeChild(divCerrar.childNodes[0,1]);
            


        intentos = 0
        cartilla = false

       
    }


}

const agregarBotonCerrar = () => {


        if( intentos == 0){
            //creando boton
            console.log("Wntrando")
            const botonCerrar = document.createElement("button")
            botonCerrar.setAttribute("id", "butcerrar")
            botonCerrar.innerText = "Borrar"
            
            
            //buscar div
            const divCerrar = document.getElementById("cerrar")
            //agregar boton al div
            divCerrar.appendChild(botonCerrar)
            intentos++

            }

        const botonCerrar = document.getElementById("butcerrar")

            botonCerrar.onclick = () =>{
    
                const divSeleccion = document.getElementById("datosseleccion")
                const nombreClub = divSeleccion.firstElementChild
                const factorPartido = nombreClub.nextElementSibling
            
                nombreClub.innerText = ""
                factorPartido.innerText = ""
                
                const divCerrar = document.getElementById("cerrar")

              
                    
                divCerrar.removeChild(divCerrar.childNodes[0,1]);
                    
                
                intentos = 0
                cartilla = false

                
            }
            

}


const actualizarGanancia = () =>{
    
    const inputMonto = document.getElementById("monto")
    const inputMultiplicadorTexto = document.getElementById("multiplicador").innerText

    inputMonto.addEventListener("keyup", () => {


        
        total = Number(inputMultiplicadorTexto) * Number(inputMonto.value)

        

        const inputTotal = document.getElementById("total")
        inputTotal.value = total

    } )


}



const confirmarApuesta = () => {

    const botonApostar = document.getElementById("apostar")


    botonApostar.onclick = () =>{

        const divInferior = document.getElementById("divinferior") 
        

        if(vacio == false){
            vacio = true
            const nuevoDiv = document.createElement("div")
            nuevoDiv.setAttribute("id", "nuevodiv")
    
            const mensaje = document.createElement("text")
            mensaje.innerText = "\n ¿Está Seguro? \n"
    
            const botonFinalSi = document.createElement("button")
            botonFinalSi.setAttribute("id", "botonfinal")
            botonFinalSi.innerText = "Sí"
    
            const botonFinalNo = document.createElement("button")
            botonFinalNo.setAttribute("id", "botonfinal")
            botonFinalNo.innerText = "No"
    
            botonFinalNo.onclick = () =>{
    
                nuevoDiv.remove()
                vacio = false
            }
            
            botonFinalSi.onclick = () =>{

                const codigoFinal = document.getElementById("codigoPartidaFinal")
                const seleccionFinal = document.getElementById("nombreseleccion")
                const montoFinal  = document.getElementById("monto")
                const gananciaFinal =  document.getElementById("total")
                
                const datosfinales = []
                datosfinales[0] = codigoFinal//.value
                datosfinales[1] = montoFinal//.value
                datosfinales[2] = gananciaFinal//.value
                datosfinales[3] = seleccionFinal//.innerText

                nuevoDiv.remove()
                
                const inputEquipo = document.getElementById("equipoelegido")
                
                //divEndpoint.appendChild(datosfinales[0])
                //divEndpoint.appendChild(datosfinales[1])
                //divEndpoint.appendChild(datosfinales[2])
                inputEquipo.value = datosfinales[2].innerText
                
                location.reload()
                console.log(datosfinales)


            }
    
            nuevoDiv.appendChild(mensaje)
            nuevoDiv.appendChild(botonFinalSi)
            nuevoDiv.appendChild(botonFinalNo)
            divInferior.appendChild(nuevoDiv)

        }




    }

}





const main = () => {

    console.log("INICIANDO JS...")
    obtenerFactores()
    

}


window.addEventListener("load", main)