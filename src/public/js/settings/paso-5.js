$('#btn-enviar').click(function(){
    $.ajax({
        method: 'POST',
        url: `/dashboard/settings`,
        data: JSON.stringify(Puesto),
        dataType: 'json',
        contentType:'application/json',
        success: (ok) => {
            window.location.href = "/dashboard";
        },
        error: (err) => {
            error("Error al buscar máquina")
        }
    })
})