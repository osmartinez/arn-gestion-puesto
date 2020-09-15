function armarTablaIncidencias() {
    $('#tabla-incidencias').html('')
    let cuantasColumnas = 3
    let columnaActual = 0
    let filaActual = 0
    let celdas = ''
    for (const incidencia of Puesto.PuestosConfiguracionesIncidencias) {
        columnaActual++

        celdas += `
        <td>
        <div class="card">
        <div class="card-header">
        ${incidencia.Nombre}
      </div>
            <div class="card-body">
    

                   <div class="row switch">
                        <div class="col-md-6">
                            <span>Habilitada</span>
                        </div>
                        <div class="col-md-6">
                            <label class="font-weight-bold">
                            <span></span>
                            <input id="check-habilitada-${incidencia.Numero}"  type="checkbox" ${incidencia.Habilitada? 'checked':''}}>
                            <span class="lever"></span>
                            </label>
                        </div>
                   </div>

                   <div class="row switch">
                        <div class="col-md-6">
                            <span>Se puede corregir</span>
                        </div>
                        <div class="col-md-6">
                            <label class="font-weight-bold">
                            <span></span>
                            <input id="check-corregible-${incidencia.Numero}" type="checkbox"  ${incidencia.Corregible? 'checked':''}}>
                            <span class="lever"></span>
                            </label>
                        </div>
                   </div>


                   <div class="row switch">
                        <div class="col-md-6">
                            <span>Avisar a:</span>
                        </div>
                        <div class="col-md-6">
                            <select>
                                <option value="NADIE"> - NADIE - </option>
                            </select>
                        </div>
                    </div>

                    <div class="row switch">
                        <div class="col-md-6">
                            <span>Pin Notificacion1:</span>
                        </div>
                        <div class="col-md-6">
                            <select>
                                <option value="GPIO4">GPIO4</option>
                            </select>
                        </div>
                    </div>

                   

                    <div class="row switch">
                        <div class="col-md-6">
                            <span>Pin Notificacion2:</span>
                        </div>
                        <div class="col-md-6">
                            <select>
                                <option value="GPIO4">GPIO4</option>
                            </select>
                        </div>
                    </div>

                    
                    <div class="row switch">
                        <div class="col-md-6">
                            <span>Segundos ejecución:</span>
                        </div>
                        <div class="col-md-6">
                            <input type="number" value="${incidencia.SegundosEjecucion}" style="width: 100px"/>
                        </div>
                    </div>
            </div>
  
        </div> 
    </td>
        `

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

    for (const incidencia of Puesto.PuestosConfiguracionesIncidencias) {
        $(`#check-habilitada-${incidencia.Numero}`).change(function () {
            if ($(`#check-habilitada-${incidencia.Numero}`).prop('checked')) {
                $(`#check-habilitada-${incidencia.Numero}`).prop('checked', true)
                incidencia.Habilitada = true
            }
            else {
                $(`#check-habilitada-${incidencia.Numero}`).prop('checked', false)
                incidencia.Habilitada = false
            }
        })

        $(`#check-corregible-${incidencia.Numero}`).change(function () {
            if ($(`#check-corregible-${incidencia.Numero}`).prop('checked')) {
                $(`#check-corregible-${incidencia.Numero}`).prop('checked', true)
                incidencia.Corregible = true
            }
            else {
                $(`#check-corregible-${incidencia.Numero}`).prop('checked', false)
                incidencia.Corregible = false
            }
        })
    }
}

$('#btn-add-incidencia').click(function () {
    Puesto.addIncidencia({
        Numero: Puesto.PuestosConfiguracionesIncidencias.length + 1,
        Nombre: $('#input-incidencia').val(),
        Habilitada: false,
        Corregible:false,
        SegundosEjecucion:0,
    })
    $('#input-incidencia').val('')
})