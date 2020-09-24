document.addEventListener("keyup", keyUp, false);
//cargarIncidencias()

let saldos = 0
let cadenaLectura = ''
let leyendoCodigo = false

function cargarIncidencias() {
    let cuantasColumnas = 2
    let fila = 0
    let contadorColumnas = 0
    let celdas = ''
    for (const incidencia of puesto.incidencias) {
        celdas += `
        <td>
            <div class="btn btn-lg btn-warning"><span class="label-btn">${incidencia.Nombre}</span></div>
        </td>`

        contadorColumnas++

        if (contadorColumnas == cuantasColumnas) {
            let codigoFila = `<tr>${celdas}</tr>`
            $('#tabla-acciones').append(codigoFila)
            celdas = ''
            contadorColumnas = ''
        }
    }

    if (celdas != '') {
        let codigoFila = `<tr>${celdas}</tr>`
        $('#tabla-acciones').append(codigoFila)
    }
}

function buscarPrepaquete(codigoPrepaquete) {
    $.ajax({
        method: 'POST',
        timeout: 3000,
        url: `/dashboard/tarea/ficharCaja`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                codigoEtiqueta: '0' + codigoPrepaquete
            }),
        success: (tareasPuesto) => {
            if (tareasPuesto != null ) {
                Puesto.refrescarTareasPuesto(tareasPuesto)
            }
            else {
                error('No se ha podido recuperar el prepaquete')
            }
        },
        error: (err) => {
            console.log(err)
        }
    })
}

function buscarOF(codigoOF) {

}
function keyUp(e) {
    console.log(e.code)
    var code = String(e.code)
    if (code.includes('Numpad') || code.includes('Digit')) {
        cadenaLectura += code[code.length - 1]
    }
    else if(e.code == 'F2'){
        // F1 PRESIONADO SIMULAR PULSO
        $.ajax({
            method: 'POST',
            timeout: 3000,
            url: `/dashboard/tarea/pulsoSimulado`,
            dataType: 'json',
            success: (tareasActualesPuesto) => {
                if(tareasActualesPuesto!=null){
                    Puesto.refrescarTareasPuesto(tareasActualesPuesto)
                }
            },
            error: (err) => {
               error(err.message)
            }
        })
        e.preventDefault()
    }

    if (cadenaLectura.length == 12) {
        let prefijo = cadenaLectura[0]
        if (prefijo == "4") {
            info(`Codigo prepaquete reconocido\n${cadenaLectura}`)
            buscarPrepaquete(cadenaLectura)
        }
        else if (prefijo == "0") {
            info(`Codigo OF reconocido\n${cadenaLectura}`)
            buscarOF(cadenaLectura)
        }
        else {
            error(`Codigo no reconocido\n${cadenaLectura}`)
        }
        cadenaLectura = ''
    }

}


$(document).ready(function () {
    $(".toggle").click(function () {
        $(this).toggleClass("cerrar")
        var icono = $(this).children('.btn-aside').children('.fas').get()[0]
        var className = icono.className
        if (className.includes('left')) {
            className = className.replace('left', 'right')
        }
        else if (className.includes('right')) {
            className = className.replace('right', 'left')
        }
        else if (className.includes('up')) {
            className = className.replace('up', 'down')
        }
        else if (className.includes('down')) {
            className = className.replace('down', 'up')
        }
        icono.className = className
    });
});

// click outside
$(document).mouseup(function (e) {
    var container = $("aside");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $("aside").removeClass("close")
    }
});

$.ajax({
    method: 'POST',
    timeout: 3000,
    url: `/dashboard/tarea/obtenerPuesto`,
    dataType: 'json',
    success: (puesto) => {
        if (puesto != null) {
            Puesto.loadPuesto(puesto.Id)
            Puesto.refrescarTareasPuesto(puesto.TareasPuesto)
        }
        else {
            error('Puesto no configurado')
        }
    },
    error: (err) => {
        error(err.message)
    }
})