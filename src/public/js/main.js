Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    return total
}

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

var loadScript = function (src, callbackfn) {
    var newScript = document.createElement("script");
    newScript.type = "text/javascript";
    newScript.setAttribute("async", "true");
    newScript.setAttribute("src", src);

    if (newScript.readyState) {
        newScript.onreadystatechange = function () {
            if (/loaded|complete/.test(newScript.readyState)) callbackfn();
        }
    } else {
        newScript.addEventListener("load", callbackfn, false);
    }

    document.documentElement.firstChild.appendChild(newScript);
}

function parpadearElemento(idElemento, error = false, mensaje, milisegundos = 4000) {
    var timer;

    function blinking() {
        timer = setInterval(blink, 400);
        function blink() {
            $(`#${idElemento}`).fadeOut(400, function () {
                $(`#${idElemento}`).fadeIn(400);
            });
        }
        setTimeout(() => {
            clearInterval(timer)
            if (mensaje) {
                Swal.close()
            }
        }, milisegundos)
    }

    if (mensaje) {
        Swal.fire({
            type: error ? 'error' : 'info',
            title: error ? '¡Error!' : 'Información',
            html: `${mensaje}`,
            showConfirmButton: false,
        })
    }

    if (idElemento) {
        blinking()
    }
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

function getAllPins(selected) {
    let ini = 1
    const fin = 24
    let pinsHTML = ''
    for (; ini <= fin; ini++) {
        pinsHTML += `<option value="GPIO${ini}" ${selected == 'GPIO' + ini ? 'selected' : ''}>GPIO${ini}</option>\n`
    }
    return pinsHTML
}

function getAllAvisos(selected) {
    const avisos = ['NADIE', 'ENCARGADO', 'INFORMATICA', 'SUMINISTRO']
    let avisosHTML = ''
    for (const aviso of avisos) {
        avisosHTML += `<option value="${aviso}" ${selected == aviso ? 'selected' : ''}>${aviso}</option>\n`
    }
    return avisosHTML
}

function armarTodo() {
    if (typeof armarFormulario == 'function') {
        armarFormulario()
        armarTablaIO()
        armarTablaIncidencias()
        armarTablaMaquinas()
        armarTablaPinsPuesto()
    }
}

let Puesto = {
    Id: 0,
    CrearNuevo: true,
    Descripcion: '',
    Observaciones: '',
    CodigoEtiqueta: '',
    CodUbicacion: '',
    FechaCracion: '',
    PuestosConfiguracionesPins: {
        PinBuzzer: '',
        PinLed: '',
        IdPuesto: 0,
    },
    PuestosConfiguracionesIncidencias: [],
    Maquinas: [],
    Operarios: [],
    loadPuesto: function (idPuesto) {
        $.ajax({
            method: 'POST',
            url: `/dashboard/settings/buscarPuestoPorId`,
            data: { idPuesto: idPuesto },
            dataType: 'json',
            success: (puesto) => {
                for (const prop in puesto) {
                    if (typeof puesto[prop] != 'function') {
                        this[prop] = puesto[prop]
                    }
                }

                for (const maq of this.Maquinas) {
                    maq.NumeroFila = maq.ID
                }

                for (const incidencia of this.PuestosConfiguracionesIncidencias) {
                    incidencia.Numero = incidencia.Id
                }

                if (typeof armarTodo === 'function') {
                    armarTodo()
                }
            },
            error: (err) => {
                error("Error al buscar máquina")
            }
        })

    },
    nuevo: function () {
        this.CrearNuevo = true
        this.Id = 0
        this.Descripcion = ''
        this.Observaciones = ''
        this.CodigoEtiqueta = ''
        this.CodUbicacion = ''
        this.FechaCracion = ''
        this.PuestosConfiguracionesPins = { PinBuzzer: '', PinLed: '', IdPuesto: 0 }
        this.PuestosConfiguracionesIncidencias = []
        this.Maquinas = []
        this.Operarios = []
        armarTodo()
    },
    refrescarTareasPuesto: function (tareasPuesto) {
        this.TareasPuesto = tareasPuesto

        refrescarTablaTareas()
        refrescarPanelCentral()
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


setInterval(() => {
    $.ajax({
        method: 'POST',
        url: `/dashboard/gpio/obtenerEstadoPins`,
        dataType: 'json',
        success: (PINS) => {
            for (const pin in PINS) {
                if (PINS[pin].status == 'on' && PINS[pin].mode == 'in') {
                    const maquina = Puesto.Maquinas.find(x => x.PinPulso == pin)
                    if (maquina != null) {
                        $.ajax({
                            method: 'POST',
                            url: `/dashboard/tarea/pulsoMaquina`,
                            contentType: "application/json",
                            dataType: 'json',
                            data: JSON.stringify({ idMaquina:maquina.ID }),
                            success: (tareasPuesto) => {
                                Puesto.refrescarTareasPuesto(tareasPuesto)
                            },
                            error: (err) => {
                                error(err.responseJSON.message)
                            }
                        })
                        break
                    }
                }
            }
        },
        error: (err) => {
            error("Error petición pins")
        }
    })
}, 100)

