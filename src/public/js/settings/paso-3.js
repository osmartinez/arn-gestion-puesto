function armarTablaIncidencias() {
    $('#tabla-incidencias').html('')
    let cuantasColumnas = 3
    let columnaActual = 0
    let filaActual = 0
    let celdas = ''
    for (const incidencia of puesto.incidencias) {
        columnaActual++
        celdas += `<td>
                        <div class="btn btn-warning" id="incidencia-${incidencia.Numero}">
                            <span>${incidencia.Nombre}</span>
                        </div>
                    </td>`

        if (columnaActual == cuantasColumnas) {
            let fila = `<tr id="fila-${filaActual}">${celdas}</tr>`
            $('#tabla-incidencias').append(fila)
            filaActual++
            celdas = ''
            columnaActual = 0;
        }

 

    }

    if(celdas != ''){
        let fila = `<tr id="fila-${filaActual}">${celdas}</tr>`
        $('#tabla-incidencias').append(fila)
    }
}

$('#btn-add-incidencia').click(function(){
    puesto.addIncidencia({
        Numero: puesto.incidencias.length+1,
        Nombre: $('#input-incidencia').val()
    })
    $('#input-incidencia').val('')
})