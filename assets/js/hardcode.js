

let cartilla = false
let total = 0

const inputTotal = document.getElementById("total")

const obtenerFactores = () =>{


    const butlocal = document.getElementById("butlocal110")
    const butvisita = document.getElementById("butvisita110")
    const butempate = document.getElementById("butempate110")
    
    butlocal.onclick = () =>{
        
        const factorlocal = butlocal.innerText
        crearCartilla(factorlocal,butlocal.id)
    }

    butempate.onclick = () =>{
        
        const factorempate = butempate.innerText
        crearCartilla(factorempate,butempate.id)
    }

    butvisita.onclick = () =>{
        
        const factorvisita = butvisita.innerText
        crearCartilla(factorvisita,butvisita.id)
    }
    
    
} 

const crearCartilla = (factor,idBoton) =>{
    
    //ACCEDIENDO AL DIV VACÍO DE LA CARTILLA
    const divCartilla = document.getElementById("cartilla")
    const divMultiplicador = document.getElementById("multiplicador")

    if(cartilla == false) {

        //ACCEDIENDO AL PARTIDO
      
        const trApuesta = document.getElementById(idBoton).parentNode.parentNode.parentNode
        
        
        console.log("TR APUESTA: ", trApuesta[1])


    
        //ACCEDIENDO AL NOMBRE DEL EQUIPO DEL FACTOR
        const nombreEquipo = document.getElementById(idBoton).parentNode.previousElementSibling.innerText
        const nombreHTML = document.createTextNode(nombreEquipo)
        //CREANDO EL TEXTO CON EL NUMERO  DEL FACTOR
        const factorApuesta = document.createTextNode(factor)
    
        
        console.log(nombreEquipo, factorApuesta)
    
        //AGREGANDO EL FACTOR
        divCartilla.appendChild(nombreHTML)
        divMultiplicador.appendChild(factorApuesta)
        //Borrar selección
        const botonBorrar = document.getElementById("borrar")
        botonBorrar.onclick = borrarSeleccion

        cartilla = true


        actualizarGanancia()

    }else{

        divCartilla.innerHTML = ""
        divMultiplicador.innerHTML = ""
        cartilla = false

        
    }


}

const borrarSeleccion = () => {

    const divSeleccion = document.getElementById("datosseleccion")
    const nombreClub = divSeleccion.firstElementChild
    const factorPartido = nombreClub.nextElementSibling

    nombreClub.innerText = ""
    factorPartido.innerText = ""



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





const main = () => {

    console.log("INICIANDO JS...")
    obtenerFactores()
    

}


window.addEventListener("load", main)