function cargarInformacionTarea(cantidadFabricadaOtrosPuestos) {
    if (Puesto.TareasPuesto != null && Puesto.TareasPuesto.detallesTarea != null && Puesto.TareasPuesto.detallesTarea.length > 0) {
        let cantidadFabricadaPuesto = 0
        let cantidadDefectuosaPuesto = 0
        let cantidadSaldosPuesto = 0

        cantidadFabricadaPuesto += Puesto.TareasPuesto.cantidadFabricadaPuesto.sum('cantidad')
        cantidadDefectuosaPuesto += Puesto.TareasPuesto.cantidadDefectuosaPuesto.sum('cantidad')
        cantidadSaldosPuesto += Puesto.TareasPuesto.cantidadSaldosPuesto.sum('cantidad')


        const cantidadFabricada = Puesto.TareasPuesto.detallesTarea.sum('cantidadFabricada') + cantidadFabricadaPuesto + cantidadDefectuosaPuesto - cantidadSaldosPuesto

        $('#info-tarea').html(`
        <p><row>${Puesto.TareasPuesto.utillaje}</row>
        </br>
        <${Puesto.TareasPuesto.tallaUtillaje}> 
        </br>
        ${cantidadFabricada} ${(cantidadFabricadaOtrosPuestos == null || cantidadFabricadaOtrosPuestos == 0 ? '' : `+${cantidadFabricadaOtrosPuestos}`)}/${Puesto.TareasPuesto.detallesTarea.sum('cantidadFabricar')}</p>`)
    }
    else {
        $('#info-tarea').html('')
    }
}

function cargarContadores() {
    if (Puesto.TareasPuesto != null && Puesto.TareasPuesto.detallesTarea != null && Puesto.TareasPuesto.detallesTarea.length > 0) {
        let cantidadFabricadaPuesto = 0
        let cantidadDefectuosaPuesto = 0
        let cantidadSaldosPuesto = 0
        let cuantosPaquetes = 0
        let cantidadUltimoPaquete = 0

            cantidadFabricadaPuesto += Puesto.TareasPuesto.cantidadFabricadaPuesto.sum('cantidad')
            cantidadDefectuosaPuesto += Puesto.TareasPuesto.cantidadDefectuosaPuesto.sum('cantidad')
            cantidadSaldosPuesto += Puesto.TareasPuesto.cantidadSaldosPuesto.sum('cantidad')
            cuantosPaquetes += Puesto.TareasPuesto.paquetes.length
            for (const paquete of Puesto.TareasPuesto.paquetes) {
                if (!paquete.cerrado) {
                    cantidadUltimoPaquete = paquete.cantidad
                }
            }
        

        if (cantidadUltimoPaquete >= Puesto.PuestosConfiguracionesPins.ContadorPaquetes) {
            parpadearElemento('card-contador-paquetes', milisegundos = 8000)
            $('.contador-paquetes').removeClass('text-success')
            $('.contador-paquetes').addClass('text-danger')
        }
        else {
            $('.contador-paquetes').removeClass('text-danger')
            $('.contador-paquetes').addClass('text-success')
        }

        $('#contador-principal').html(String(cantidadFabricadaPuesto + cantidadDefectuosaPuesto))
        $('#contador-saldos').html(String(cantidadSaldosPuesto))
        $('#contador-paquetes').html(String(cuantosPaquetes == 0 ? 0 : cuantosPaquetes))
        $('#sumador-pares-paquete').html(String(cantidadUltimoPaquete))

    }
    else {
        $('#contador-principal').html('0')
        $('#contador-saldos').html('0')
        $('#contador-paquetes').html('0')
        $('#sumador-pares-paquete').html('0')
    }
}

function cargarIncidencias() {

}


function refrescarPanelCentral() {
    cargarInformacionTarea()
    cargarContadores()
    cargarIncidencias()
}

let timerContadorPrincipal = null
let timerContadorSaldos = null
let contadorPrincipal = 0
let contadorSaldos = 0
function doTimerContadorPrincipal() {
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/actualizarDefectuosas`,
        data: { defectuosas: contadorPrincipal },
        dataType: 'json',
        success: (tareasPuesto) => {
            Puesto.refrescarTareasPuesto(tareasPuesto)
        },
        error: (err) => {
            error(err.responseJSON.message)
        }
    })
    $('#sumador-principal').addClass('d-none')
    contadorPrincipal = 0

}
function doTimerContadorSaldos() {
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/actualizarSaldos`,
        data: { saldos: contadorSaldos },
        dataType: 'json',
        success: (tareasPuesto) => {
            Puesto.refrescarTareasPuesto(tareasPuesto)
        },
        error: (err) => {
            error(err.responseJSON.message)
        }
    })
    $('#sumador-saldos').addClass('d-none')
    contadorSaldos = 0
}

function arrancarTimerContadorSaldos() {
    if (timerContadorSaldos != null) {
        clearTimeout(timerContadorSaldos)
    }
    $('#sumador-saldos').removeClass('d-none')
    if (contadorSaldos > 0) {
        $('#sumador-saldos').html(`<i class="fa fa-arrow-up"></i> ${contadorSaldos}`)
        $('#sumador-saldos').removeClass('text-danger')
        $('#sumador-saldos').addClass('text-success')

    }
    else if (contadorSaldos < 0) {
        $('#sumador-saldos').html(`<i class="fa fa-arrow-down"></i> ${contadorSaldos * -1}`)
        $('#sumador-saldos').removeClass('text-success')
        $('#sumador-saldos').addClass('text-danger')
    }
    else {
        $('#sumador-saldos').html(`${contadorSaldos}`)
    }

    timerContadorSaldos = setTimeout(doTimerContadorSaldos, 2000)
}

function arrancarTimerContadorPrincipal() {
    if (timerContadorPrincipal != null) {
        clearTimeout(timerContadorPrincipal)
    }
    $('#sumador-principal').removeClass('d-none')
    if (contadorPrincipal > 0) {
        $('#sumador-principal').html(`<i class="fa fa-arrow-up"></i> ${contadorPrincipal}`)
        $('#sumador-principal').removeClass('text-danger')
        $('#sumador-principal').addClass('text-success')

    }
    else if (contadorPrincipal < 0) {
        $('#sumador-principal').html(`<i class="fa fa-arrow-down"></i> ${contadorPrincipal * -1}`)
        $('#sumador-principal').removeClass('text-success')
        $('#sumador-principal').addClass('text-danger')
    }
    else {
        $('#sumador-principal').html(`${contadorPrincipal}`)
    }

    timerContadorPrincipal = setTimeout(doTimerContadorPrincipal, 2000)
}

$('#btn-sumar-principal').click(function () {
    contadorPrincipal += 1
    arrancarTimerContadorPrincipal()
})

$('#btn-restar-principal').click(function () {
    contadorPrincipal -= 1
    arrancarTimerContadorPrincipal()
})

$('#btn-sumar-saldos').click(function () {
    contadorSaldos += 1
    arrancarTimerContadorSaldos()
})

$('#btn-restar-saldos').click(function () {
    contadorSaldos -= 1
    arrancarTimerContadorSaldos()
})

$('#btn-terminar-tarea').click(function () {
    if (Puesto.EsManual) {
        $('#input-pares-producidos').val(Puesto.TareasPuesto.detallesTarea.sum('cantidadFabricar'))
        $('#input-pares-defectuosos').val(0)
        $('#input-pares-saldos').val(0)

        $('#modal-terminar-manual').modal('show');
    }
    else {
        $.ajax({
            method: 'POST',
            url: `/dashboard/tarea/terminar`,
            dataType: 'json',
            success: (tareasPuesto) => {
                Puesto.refrescarTareasPuesto(tareasPuesto)
            },
            error: (err) => {
                error(err.responseJSON.message)
            }
        })
    }

})

$('#btn-normalizar-paquetes').click(function () {
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/normalizarPaquetes`,
        dataType: 'json',
        success: (tareasPuesto) => {
            Puesto.refrescarTareasPuesto(tareasPuesto)
        },
        error: (err) => {
            error(err.responseJSON.message)
        }
    })
})