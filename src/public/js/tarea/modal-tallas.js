function cargarTareaAPartirDeOperacionYTallas(){
    if(Puesto.TallaFichada!= '' && Puesto.IdOperacionFichada != 0){

    }
}

function cargarTallasModalTallas(tallas) {
    var buttonNum = tallas.length,
        rowButtonNumber = 4;

    var table = document.getElementById("modal-body-tallas");
    let indiceTallas = 0

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