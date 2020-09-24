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
        $('#contador-principal').html(String(Puesto.TareasPuesto.tareas.sum('cantidadFabricadaConfirmada')-Puesto.TareasPuesto.tareas.sum('cantidadDefectuosaConfirmada')))
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

