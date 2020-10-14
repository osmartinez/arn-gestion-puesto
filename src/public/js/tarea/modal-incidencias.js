function registrarIncidencia(id){
    const incidencia = Puesto.PuestosConfiguracionesIncidencias.find(x=>x.Id == id)

    if(incidencia != null && incidencia.Habilitada){
        // registrar incidencia
        $.ajax({
            method: 'POST',
            url: `/dashboard/tarea/incidencia/nueva`,
            dataType: 'json',
            data: JSON.stringify(incidencia),
            contentType:'application/json',
            success: (respuesta) => {
               
            },
            error: (err) => {
                error(err.responseJSON.message)
            }
        })

        if(incidencia.Corregible){

        }
    }
}