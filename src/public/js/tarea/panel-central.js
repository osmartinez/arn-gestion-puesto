let intervaloAlertaVisual = null

function encenderAlertaVisual(errorMsg) {
    if (intervaloAlertaVisual != null) {
        clearInterval(intervaloAlertaVisual)
    }
    let ofs = 0
    error(errorMsg)
    intervaloAlertaVisual = setInterval(function () {
        $('#panel-central').css('background', 'rgba(255,0,0,' + Math.abs(Math.sin(ofs)) + ')');
        ofs += 0.03;
    }, 10);
}

function apagarAlertaVisual() {
    if (intervaloAlertaVisual != null) {
        clearInterval(intervaloAlertaVisual)
        $('#panel-central').css('background', '');
        info('Solucionado')
    }
}

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
        for(const tarea of Puesto.TareasPuesto.tareas){
            cantidadFabricadaPuesto+= tarea.cantidadFabricadaPuesto.sum('cantidad')
            cantidadDefectuosaPuesto+= tarea.cantidadDefectuosaPuesto.sum('cantidad')

        }
        $('#contador-principal').html(String(cantidadFabricadaPuesto+cantidadDefectuosaPuesto))
    }
    else{
        $('#contador-principal').html('0')
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
let contadorPrincipal = 0
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


