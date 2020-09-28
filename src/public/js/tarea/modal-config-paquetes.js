$('#btn-menos-config-paquetes').click(function(){
    $('#input-pares-paquete').val(Number($('#input-pares-paquete').val())-1)
})

$('#btn-mas-config-paquetes').click(function(){
    $('#input-pares-paquete').val(Number($('#input-pares-paquete').val())+1)
})

$('#btn-guardar-config-paquetes').click(function(){
    $.ajax({
        method: 'POST',
        url: `/dashboard/settings/configurarPaquetes`,
        data: JSON.stringify({
            Id: Puesto.Id,
            ContadorPaquetes: $('#input-pares-paquete').val(),
            EsContadorPaquetesAutomatico: $('#check-contador-paquete-manual').is(":checked")
        }),
        dataType: 'json',
        contentType:'application/json',
        success: (ok) => {
            window.location.href = "/dashboard/tarea";
        },
        error: (err) => {
            error(err.responseJSON.message)
        }
    })
})