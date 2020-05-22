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
    console.log('triggered')
    const codSeccion = $(this).find(":selected").val()
    const selectMaquinas = document.getElementById('select-maquinas')
    selectMaquinas.innerHTML = ''
    $.ajax({
        method: 'POST',
        url: `/dashboard/settings/maquinasEnSeccion`,
        data: {codSeccion : codSeccion},
        dataType: 'json',
        success:(maquinas)=>{
            let innerHTML = ''
            if (maquinas) {
                for (const maquina of maquinas) {
                    innerHTML+= `<option value="${maquina.ID}">${maquina.Nombre}</option>`
                }
            }
            selectMaquinas.innerHTML = innerHTML
        },
        error: (err)=>{
            console.log(error)
        }
    })
})