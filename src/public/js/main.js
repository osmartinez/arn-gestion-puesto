function error(msg) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    })

    Toast.fire({
        type: 'error',
        title: msg
    })
}

function info(msg) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    })

    Toast.fire({
        type: 'success',
        title: msg
    })
}

var loadScript = function(src, callbackfn) {
    var newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.setAttribute("async", "true");
    newScript.setAttribute("src", src);

    if(newScript.readyState) {
        newScript.onreadystatechange = function() {
            if(/loaded|complete/.test(newScript.readyState)) callbackfn();
        }
    } else {
        newScript.addEventListener("load", callbackfn, false);
    }

    document.documentElement.firstChild.appendChild(newScript);
}


const Puesto = {
    Id: 0,
    CrearNuevo:false,
    Descripcion: '',
    Observaciones: '',
    CodigoEtiqueta: '',
    CodUbicacion: '',
    FechaCracion: '',
    PuestosConfiguracionesPins:{
        PinBuzzer: '',
        PinLed:''
    },
    PuestosConfiguracionesIncidencias:[],
    Maquinas: [],
    addMaquina: function (maquina) {
        if (typeof maquina != 'undefined') {
            if (Puesto.Maquinas.filter(x => x.ID == maquina.ID).length == 0) {
                Puesto.Maquinas.push(maquina)
                armarTablaIO()
                info("Maquina añadida")
            }
            else {
                error("Maquina repetida")
            }
        }
    },

    removeMaquina: function (maquina) {
        if (typeof maquina != 'undefined') {
            Puesto.Maquinas = Puesto.Maquinas.filter(x => x.NumeroFila != maquina.NumeroFila)
            armarTablaIO()
        }
    },

    addIncidencia: function (incidencia) {
        if (typeof incidencia != 'undefined') {
            if (Puesto.PuestosConfiguracionesIncidencias.filter(x => x.Nombre == incidencia.Nombre).length == 0) {
                Puesto.PuestosConfiguracionesIncidencias.push(incidencia)
                armarTablaIncidencias()
                info("Incidencia añadida")
            }
            else {
                error("Incidencia repetida")
            }
        }

    }
}