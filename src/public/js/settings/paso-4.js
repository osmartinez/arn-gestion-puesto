function armarTablaIncidencias() {
    $('#tabla-incidencias').html('')
    let cuantasColumnas = 3
    let columnaActual = 0
    let filaActual = 0
    let celdas = ''
    for (const incidencia of Puesto.PuestosConfiguracionesIncidencias) {
        columnaActual++
        /*celdas += `<td>
                        <div class="btn btn-lg ${incidencia.Habilitada? 'btn-success':'btn-warning'}" id="incidencia-${incidencia.Numero}">
                            <span>${incidencia.Nombre}</span>
                        </div>
                    </td>`*/

        celdas += `
        <td>
        <label class="btn btn-lg btn-primary ${incidencia.Habilitada? 'active':''}">
            <input type="checkbox"  ${incidencia.Habilitada? 'checked':''} name="incidencia-${incidencia.Nombre}" id="incidencia-${incidencia.Numero}">
            ${incidencia.Nombre}
        </label>
        </td>`

        if (columnaActual == cuantasColumnas) {
            let fila = `<tr id="fila-${filaActual}">${celdas}</tr>`
            $('#tabla-incidencias').append(fila)
            filaActual++
            celdas = ''
            columnaActual = 0;
        }



    }

    if (celdas != '') {
        let fila = `<tr id="fila-${filaActual}">${celdas}</tr>`
        $('#tabla-incidencias').append(fila)
    }

    for(const incidencia of Puesto.PuestosConfiguracionesIncidencias){
        $(`#incidencia-${incidencia.Numero}`).change(function(){

            if( $(`#incidencia-${incidencia.Numero}`).prop('checked')){
                $(`#incidencia-${incidencia.Numero}`).prop('checked',true)
                incidencia.Habilitada = true
            }
            else{
                $(`#incidencia-${incidencia.Numero}`).prop('checked',false)
                incidencia.Habilitada = false
            }
        })
    }
}

$('#btn-add-incidencia').click(function () {
    Puesto.addIncidencia({
        Numero: Puesto.PuestosConfiguracionesIncidencias.length + 1,
        Nombre: $('#input-incidencia').val(),
        Habilitada: true,
    })
    $('#input-incidencia').val('')
})