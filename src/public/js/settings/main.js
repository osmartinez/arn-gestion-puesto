$(document).ready(function () {
    $('.stepper').mdbStepper();
    $('.mdb-select').materialSelect();
    Keyboard.init();
})

$('#select-secciones').change(function () {
    const codSeccion = $(this).find(":selected").val()
    $.ajax({
        url: `/dashboard/settings/maquinasEnSeccion/${codSeccion}`,
        dataType: 'json'
    }).done((maquinas) => {
        if(maquinas){
            for(const maquina of maquinas){
                $('#select-maquinas').append(`<option value="${maquina.ID}">${maquina.Nombre}</option>`)
            }
        }

        
    }).fail((err) => {
        console.log(err)
    })
})