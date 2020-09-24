function error(msg) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    })

    swal.close()

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


const allPins = `
<option value="GPIO4">GPIO4</option>
<option value="GPIO5">GPIO5</option>
<option value="GPIO6">GPIO6</option>
<option value="GPIO8">GPIO8</option>
<option value="GPIO9">GPIO9</option>
<option value="GPIO10">GPIO10</option>
<option value="GPIO11">GPIO11</option>
`

function getAllPins(selected){
    let ini = 1
    const fin = 24
    let pinsHTML = ''
    for(;ini<=fin;ini++){
        pinsHTML += `<option value="GPIO${ini}" ${selected=='GPIO'+ini? 'selected':''}>GPIO${ini}</option>\n`
    }
    return pinsHTML
}

function getAllAvisos(selected){
    const avisos = ['NADIE', 'ENCARGADO','INFORMATICA','SUMINISTRO']
    let avisosHTML = ''
    for(const aviso of avisos){
        avisosHTML += `<option value="${aviso}" ${selected==aviso? 'selected':''}>${aviso}</option>\n`
    }
    return avisosHTML
}

function armarTodo(){
    armarFormulario()
    armarTablaIO()
    armarTablaIncidencias()
    armarTablaMaquinas()
    armarTablaPinsPuesto()
}

const Puesto = {
    Id: 0,
    CrearNuevo:true,
    Descripcion: '',
    Observaciones: '',
    CodigoEtiqueta: '',
    CodUbicacion: '',
    FechaCracion: '',
    PuestosConfiguracionesPins:{
        PinBuzzer: '',
        PinLed:'',
        IdPuesto:0,
    },
    PuestosConfiguracionesIncidencias:[],
    Maquinas: [],
    Operarios: [],
    loadPuesto: function(idPuesto){
        $.ajax({
            method: 'POST',
            url: `/dashboard/settings/buscarPuestoPorId`,
            data: { idPuesto: idPuesto },
            dataType: 'json',
            success: (puesto) => {
                this.CrearNuevo = false
                for(const prop in puesto){
                    if(typeof puesto[prop] != 'function'){
                        this[prop] = puesto[prop]
                    }
                }

                for(const maq of this.Maquinas){
                    maq.NumeroFila = maq.ID
                }

                for (const incidencia of this.PuestosConfiguracionesIncidencias){
                    incidencia.Numero = incidencia.Id
                }
                
                armarTodo()
            },
            error: (err) => {
                error("Error al buscar máquina")
            }
        })

    },
    nuevo: function(){
        this.CrearNuevo = true
        this.Id = 0
        this.Descripcion = ''
        this.Observaciones = ''
        this.CodigoEtiqueta = ''
        this.CodUbicacion = ''
        this.FechaCracion = ''
        this.PuestosConfiguracionesPins = {PinBuzzer: '', PinLed: '', IdPuesto: 0}
        this.PuestosConfiguracionesIncidencias = []
        this.Maquinas = [] 
        this.Operarios = []
        armarTodo()
    },
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