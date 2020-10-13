$('#btn-terminar-manual').click(function(){
    console.log('hola')
    $.ajax({
        method: 'POST',
        url: `/dashboard/tarea/terminarManual`,
        dataType: 'json',
        data: JSON.stringify({
            fabricada:$('#input-pares-producidos').val(),
            defectuosa:$('#input-pares-defectuosos').val(),
            saldos: $('#input-pares-saldos').val(),
        }),
        contentType:'application/json',
        success: (tareasPuesto) => {
            Puesto.refrescarTareasPuesto(tareasPuesto)
            $('#modal-terminar-manual').modal('hide');
        },
        error: (err) => {
            error(err.responseJSON.message)
        }
    })
})