function cargarIncidencias(){
    let cuantasColumnas = 2
    let fila = 0
    let contadorColumnas = 0
    let celdas = ''
    for(const incidencia of puesto.incidencias){
        celdas += `
        <td>
            <div class="btn btn-lg btn-warning"><span class="label-btn">${incidencia.Nombre}</span></div>
        </td>`

        contadorColumnas++

        if(contadorColumnas == cuantasColumnas){
            let codigoFila = `<tr>${celdas}</tr>`
            $('#tabla-acciones').append(codigoFila)
            celdas = ''
            contadorColumnas = ''
        }
    }

    if(celdas != ''){
        let codigoFila = `<tr>${celdas}</tr>`
        $('#tabla-acciones').append(codigoFila)
    }
}

cargarIncidencias()