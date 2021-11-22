

const cambiarvalor = () =>{

    const fechabut = document.getElementById("fecha")
    fechabut.innerHTML = "a"
}

const main = () => {
    console.log("INICIANDO JS...")
    const fechabut = document.getElementById("fecha")
    fechabut.onclick = cambiarvalor


}


window.addEventListener("load", main)