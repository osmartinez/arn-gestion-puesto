function cargarTareaAPartirDeOperacionYTallas(){
    if(Puesto.TallaFichada!= '' && Puesto.IdOperacionFichada != 0){
        $.ajax({
            method: 'POST',
            timeout: 3000,
            url: `/dashboard/tarea/comenzarTareaConOperacionYTalla`,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    idOperacion: Puesto.IdOperacionFichada,
                    talla: Puesto.TallaFichada,
                }),
            success: (tareasPuesto) => {
                if (tareasPuesto != null) {
                    Puesto.refrescarTareasPuesto(tareasPuesto)
                }
                else {
                    error('No se ha podido recuperar la información')
                }
            },
            error: (err) => {
                switch (err.status) {
                    case 404:
                        error('No existe la etiqueta!')
                        break
                    case 403:
                        parpadearElemento('btn-terminar-tarea', error = true, 'La etiqueta no coincide con el utillaje que hay actualmente.\nTermine antes la tarea actual.')
                        break
                    case 405:
                        parpadearElemento('btn-operarios', error = true, `<h4>${err.responseJSON.message}</h4></br><a href="/dashboard/operarios" class="btn btn-lg btn-success"><h4 style="font-weight:bold;">Fichar ahora</h4></a>`)
                        break
                }
    
            }
        })
    }
}

function cargarTallasModalTallas(tallas) {
    var buttonNum = tallas.length,
        rowButtonNumber = 4;

    var table = document.getElementById("modal-body-tallas");
    let indiceTallas = 0
    table.innerHTML = ''
    for (var i = 0; i < buttonNum; i++) {
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var j = 0; j < rowButtonNumber; j++, i++) {
            var td = document.createElement("td");
            var btn = document.createElement("div");
            var span = document.createElement("span");
            btn.className = 'btn btn-lg btn-warning btn-talla'
            span.className = "text-talla"
            if (i < buttonNum) {
                span.innerHTML = tallas[indiceTallas].Talla;
                btn.id = tallas[indiceTallas].Talla;
            }

            btn.onclick = function () {
                Puesto.TallaFichada = this.id;
                $('#modal-tallas').modal('hide');
                cargarTareaAPartirDeOperacionYTallas();
            };

            if (i >= buttonNum) {
                break;
            } else {
                btn.appendChild(span)
                td.appendChild(btn);
                tr.appendChild(td);
                indiceTallas++
            }
        }
        i--;
    }

}