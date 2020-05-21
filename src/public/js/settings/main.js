$(document).ready(function () {
    $('.stepper').mdbStepper();
    $('.mdb-select').materialSelect();
    const $valueSpan = $('#label-ritmo-ideal');
    const $value = $('#input-ritmo-ideal');
    $valueSpan.html($value.val());
    $value.on('input change', () => {
        $valueSpan.html($value.val());
    });
    Keyboard.init();
})

$('#select-secciones').change(function () {
    const codSeccion = $(this).find(":selected").val()
    $('#select-maquinas').html('')
    $.ajax({
        url: `/dashboard/settings/maquinasEnSeccion/${codSeccion}`,
        dataType: 'json'
    }).done((maquinas) => {
        if (maquinas) {
            for (const maquina of maquinas) {
                $('#select-maquinas').append(`<option value="${maquina.ID}">${maquina.Nombre}</option>`)
            }
        }
    }).fail((err) => {
        console.log(err)
    })
})