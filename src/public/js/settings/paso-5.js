$('#btn-enviar').click(function(){
    $.ajax({
        method: 'POST',
        url: `/dashboard/settings`,
        data: Puesto,
        dataType: 'json',
        success: (ok) => {
            window.location.href = "/dashboard";
        },
        error: (err) => {
            error("Error al buscar máquina")
        }
    })
})