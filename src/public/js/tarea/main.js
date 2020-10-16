document.addEventListener("keyup", keyUp, false);

let saldos = 0
let cadenaLectura = ''
let leyendoCodigo = false

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
            if (tareasPuesto != null) {
                Puesto.refrescarTareasPuesto(tareasPuesto)
            }
            else {
                error('No se ha podido recuperar el prepaquete')
            }
        },
        error: (err) => {
            switch (err.status) {
                case 404:
                    error('No existe la etiqueta!')
                    break
                case 403:
                    parpadearElemento('btn-terminar-tarea', error = true, 'La etiqueta no coincide con el utillaje que hay actualmente.\nTermine antes la tarea actual.')
                    break
                case 405:
                    parpadearElemento('btn-operarios', error = true, `<h4>${err.responseJSON.message}</h4></br><a href="/dashboard/operarios" class="btn btn-lg btn-success"><h4 style="font-weight:bold;">Fichar ahora</h4></a>`)
                    break
            }

        }
    })
}

function buscarOF(codigoEtiqueta) {
    $.ajax({
        method: 'POST',
        timeout: 3000,
        url: `/dashboard/tarea/ficharOF`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(
            {
                codigoEtiqueta: '0' + codigoEtiqueta
            }),
        success: (body) => {
            if (body != null) {
                Puesto.IdOrdenFichada = body.idOrden
                cargarTallasModalTallas(body.tallas)

                if(body.operaciones.length == 1){
                    Puesto.IdOperacionFichada = body.operaciones[0].IdOperacion
                    $('#modal-tallas').modal('show')
                }
                else if(body.operaciones.length > 1){
                    cargarOperacionesModalMultiOperacion(body.operaciones)
                    $('#modal-multi-operacion').modal('show')
                }
                else{
                    error('No hay operaciones')
                }
            }
            else {
                error('No se ha podido recuperar la información')
            }
        },
        error: (err) => {
            error(err.responseJSON.message)
        }
    })
}

function keyUp(e) {
    var code = String(e.code)
    if (code.includes('Numpad') || code.includes('Digit')) {
        cadenaLectura += code[code.length - 1]
    }
    else if (e.code == 'F2') {
        // F1 PRESIONADO SIMULAR PULSO
        $.ajax({
            method: 'POST',
            timeout: 3000,
            url: `/dashboard/tarea/pulsoSimulado`,
            dataType: 'json',
            success: (tareasActualesPuesto) => {
                if (tareasActualesPuesto != null) {
                    Puesto.refrescarTareasPuesto(tareasActualesPuesto)
                }
            },
            error: (err) => {
                error(err.responseJSON.message)
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
        error(err.responseJSON.message)
    }
})

setInterval(() => {
    if (Puesto != null && !Puesto.EsManual) {
        $.ajax({
            method: 'POST',
            url: `/dashboard/gpio/obtenerEstadoPins`,
            dataType: 'json',
            success: (PINS) => {
                for (const pin in PINS) {

                    // detectar pulso principal pares
                    if (PINS[pin].type == 'main-pulse' && PINS[pin].status == 'on' && PINS[pin].mode == 'in') {
                        if (PINS[pin].flanco == 'up') {
                            const pulso = PINS[pin].pulsesUp.pop()
                            if (pulso === 1) {
                                const maquina = Puesto.Maquinas.find(x => x.PinPulso == pin)
                                if (maquina != null) {
                                    $.ajax({
                                        method: 'POST',
                                        url: `/dashboard/tarea/pulsoMaquina`,
                                        contentType: "application/json",
                                        dataType: 'json',
                                        data: JSON.stringify(
                                            {
                                                IdMaquina: maquina.ID,
                                                EsPulsoManual: maquina.EsPulsoManual,
                                                ProductoPorPulso: maquina.ProductoPorPulso,
                                                PinPulso: maquina.PinPulso,
                                                DescontarAutomaticamente: maquina.DescontarAutomaticamente
                                            }),
                                        success: (tareasPuesto) => {
                                            Puesto.refrescarTareasPuesto(tareasPuesto)
                                        },
                                        error: (err) => {
                                            switch (err.status) {
                                                case 405:
                                                    parpadearElemento('btn-operarios', error = true, `<h4>${err.responseJSON.message}</h4></br><a href="/dashboard/operarios" class="btn btn-lg btn-success"><h4 style="font-weight:bold;">Fichar ahora</h4></a>`)
                                                    break
                                                default:
                                                    error(err.responseJSON.message)
                                                    break
                                            }
                                        }
                                    })
                                    break
                                }
                            }
                        }

                    }
                }
            },
            error: (err) => {
                switch (err.status) {
                    case 405:
                        parpadearElemento('btn-operarios', error = true, `<h4>${err.responseJSON.message}</h4></br><a href="/dashboard/operarios" class="btn btn-lg btn-success"><h4 style="font-weight:bold;">Fichar ahora</h4></a>`)
                        break
                    default:
                        error(err.responseJSON.message)
                        break
                }
            }
        })
    }

}, 200)

// intervalor que busca todos los pares fabricados de la tarea actual por otros puestos
setInterval(() => {
    if (Puesto != null && Puesto.TareasPuesto != null && Puesto.TareasPuesto.detallesTarea.length > 0) {
        const idsTareas = []
        for (const detalle of Puesto.TareasPuesto.detallesTarea) {
            idsTareas.push(detalle.idSql)
        }
        $.ajax({
            method: 'POST',
            url: `/dashboard/tarea/recopilarParesOtrosPuestos`,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(
                {
                    idPuesto: Puesto.Id,
                    idsTareas: idsTareas
                }),
            success: (resultado) => {
                cargarInformacionTarea(resultado.cantidad)
            },
            error: (err) => {
                switch (err.status) {
                    default:
                        error(err.responseJSON.message)
                        break
                }
            }
        })
    }

}, 5000)