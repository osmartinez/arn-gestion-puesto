function cargarOperacionesModalMultiOperacion(operaciones){
    let htmlOperaciones = ''
    for(const operacion of operaciones){
        htmlOperaciones+=`
            <div class="row btn btn-lg btn-success">
                <div class="col-md-12">
                    <span class="texto-operacion">${operacion.Descripcion}</span>
                </div>
            </div>
        \n`
    }
    
    $('#modal-body-multi-operacion').html(`
        ${htmlOperaciones}
    `)
}