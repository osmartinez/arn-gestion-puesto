$(document).ready(function () {
    $('.stepper').mdbStepper();
    //$('.mdb-select').materialSelect();
    const $valueSpan = $('#label-ritmo-ideal');
    const $value = $('#input-ritmo-ideal');
    $valueSpan.html($value.val());
    $value.on('input change', () => {
        $valueSpan.html($value.val());
    });
    Keyboard.init();
})

const puesto = {
    observaciones: '',
    maquinas: [],
    incidencias: [],
    addMaquina: function (maquina){
        if(puesto.maquinas.filter(x=>x.ID == maquina.ID).length==0){
            puesto.maquinas.push(maquina)
            armarTablaIO()
            info("Maquina añadida")
        }
        else{
            error("Maquina repetida")
        }
    },

    removeMaquina: function (maquina){
        puesto.maquinas = puesto.maquinas.filter(x => x.NumeroFila != maquina.NumeroFila)
        armarTablaIO()
    },

    addIncidencia: function(incidencia){
        if(puesto.incidencias.filter(x=>x.Nombre == incidencia.Nombre).length==0){
            puesto.incidencias.push(incidencia)
            armarTablaIncidencias()
            info("Incidencia añadida")
        }
        else{
            error("Incidencia repetida")
        }

    }
}




