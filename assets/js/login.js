const mensaje = (aut) =>{
    const bloque = document.getElementById("aviso")
    const aviso = document.createElement("span")
    aviso.setAttribute("class", "border border-danger rounded p-2") 
    aviso.setAttribute("id","error") 
    if (aut == 1) {        
        aviso.innerText = "Contraseña o correo incorrecto"
        bloque.appendChild(aviso)
    } else if (aut ==2 ){
        aviso.innerText = "Cuenta desactivada. Comuniquese con el administrador para solucionar este inconveniente"
        bloque.appendChild(aviso)
    }
}

const main = () => {
    console.log("INICIANDO JS...")
    const params = new URLSearchParams(window.location.search)
    const aut =  params.get('aut')
    mensaje(aut)
    console.log(aut)
}


window.addEventListener("load", main)