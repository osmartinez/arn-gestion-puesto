function cargarInformacionTarea(){
    if(Puesto.TareasPuesto!=null && Puesto.TareasPuesto.tareas != null &&  Puesto.TareasPuesto.tareas.length>0){
        $('#info-tarea').html(`
        <p>${Puesto.TareasPuesto.tareas[0].utillaje}
        </br>
        <${Puesto.TareasPuesto.tareas[0].tallaUtillaje}>
        </br>
        ${Puesto.TareasPuesto.tareas.sum('cantidadFabricar')}</p>`)
    }
    else{
        $('#info-tarea').html('')
    }
}

function cargarContadores(){
    if(Puesto.TareasPuesto!=null && Puesto.TareasPuesto.tareas != null &&  Puesto.TareasPuesto.tareas.length>0){
        let cantidadFabricadaPuesto = 0
        let cantidadDefectuosaPuesto = 0
        let cantidadSaldosPuesto = 0

        for(const tarea of Puesto.TareasPuesto.tareas){
            cantidadFabricadaPuesto+= tarea.cantidadFabricadaPuesto.sum('cantidad')
            cantidadDefectuosaPuesto+= tarea.cantidadDefectuosaPuesto.sum('cantidad')
            cantidadSaldosPuesto+= tarea.cantidadSaldosPuesto.sum('cantidad')
        }
        $('#contador-principal').html(String(cantidadFabricadaPuesto+cantidadDefectuosaPuesto))
        $('#contador-saldos').html(String(cantidadSaldosPuesto))
    }
    else{
        $('#contador-principal').html('0')
        $('#contador-saldos').html('0')
    }
}

function cargarIncidencias(){

} 


function refrescarPanelCentral(){
    cargarInformacionTarea()
    cargarContadores()
    cargarIncidencias()
}

let timerContadorPrincipal = null
let timerContadorSaldos = null
let contadorPrincipal = 0
let contadorSaldos = 0
function doTimerContadorPrincipal(){
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/actualizarDefectuosas`,
        data: { defectuosas: contadorPrincipal },
        dataType: 'json',
        success: (tareasPuesto) => {
          Puesto.refrescarTareasPuesto(tareasPuesto)
        },
        error: (err) => {
            error(err.message)
        }
    })
    $('#sumador-principal').addClass('d-none')
    contadorPrincipal =0

}
function doTimerContadorSaldos(){
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/actualizarSaldos`,
        data: { saldos: contadorSaldos },
        dataType: 'json',
        success: (tareasPuesto) => {
          Puesto.refrescarTareasPuesto(tareasPuesto)
        },
        error: (err) => {
            error(err.message)
        }
    })
    $('#sumador-saldos').addClass('d-none')
    contadorSaldos =0
}

function arrancarTimerContadorSaldos(){
    if(timerContadorSaldos!=null){
        clearTimeout(timerContadorSaldos)
    }
    $('#sumador-saldos').removeClass('d-none')
    if(contadorSaldos>0){
        $('#sumador-saldos').html(`<i class="fa fa-arrow-up"></i> ${contadorSaldos}`)
        $('#sumador-saldos').removeClass('text-danger')
        $('#sumador-saldos').addClass('text-success')

    }
    else if (contadorSaldos<0){
        $('#sumador-saldos').html(`<i class="fa fa-arrow-down"></i> ${contadorSaldos*-1}`)
        $('#sumador-saldos').removeClass('text-success')
        $('#sumador-saldos').addClass('text-danger')    }
    else{
        $('#sumador-saldos').html(`${contadorSaldos}`)
    }

    timerContadorSaldos = setTimeout(doTimerContadorSaldos,2000)
}

function arrancarTimerContadorPrincipal(){
    if(timerContadorPrincipal!=null){
        clearTimeout(timerContadorPrincipal)
    }
    $('#sumador-principal').removeClass('d-none')
    if(contadorPrincipal>0){
        $('#sumador-principal').html(`<i class="fa fa-arrow-up"></i> ${contadorPrincipal}`)
        $('#sumador-principal').removeClass('text-danger')
        $('#sumador-principal').addClass('text-success')

    }
    else if (contadorPrincipal<0){
        $('#sumador-principal').html(`<i class="fa fa-arrow-down"></i> ${contadorPrincipal*-1}`)
        $('#sumador-principal').removeClass('text-success')
        $('#sumador-principal').addClass('text-danger')    }
    else{
        $('#sumador-principal').html(`${contadorPrincipal}`)
    }

    timerContadorPrincipal = setTimeout(doTimerContadorPrincipal,2000)
}

$('#btn-sumar-principal').click(function(){
    contadorPrincipal += 1
    arrancarTimerContadorPrincipal()
})

$('#btn-restar-principal').click(function(){
    contadorPrincipal -= 1
   arrancarTimerContadorPrincipal()
})

$('#btn-sumar-saldos').click(function(){
    contadorSaldos += 1
    arrancarTimerContadorSaldos()
})

$('#btn-restar-saldos').click(function(){
    contadorSaldos -= 1
    arrancarTimerContadorSaldos()
})

$('#btn-terminar-tarea').click(function(){
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/terminar`,
        dataType: 'json',
        success: (tareasPuesto) => {
          Puesto.refrescarTareasPuesto(tareasPuesto)
        },
        error: (err) => {
            error(err.message)
        }
    })
})

