function error(msg){
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

function info(msg){
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

const puesto = {
    observaciones: '',
    maquinas: [],
    incidencias: [{Nombre:'AVERÍA', Numero: 1},{Nombre:'AVERÍA', Numero: 1},{Nombre:'AVERÍA', Numero: 1},{Nombre:'AVERÍA', Numero: 1}],
    addMaquina: function (maquina){
        if(puesto.maquinas.filter(x=>x.ID == maquina.ID).length==0){
            puesto.maquinas.push(maquina)
            armarTablaIO()
            info("Maquina añadida")
        }
        else{
            error("Maquina repetida")
        }
    },

    removeMaquina: function (maquina){
        puesto.maquinas = puesto.maquinas.filter(x => x.NumeroFila != maquina.NumeroFila)
        armarTablaIO()
    },

    addIncidencia: function(incidencia){
        if(puesto.incidencias.filter(x=>x.Nombre == incidencia.Nombre).length==0){
            puesto.incidencias.push(incidencia)
            armarTablaIncidencias()
            info("Incidencia añadida")
        }
        else{
            error("Incidencia repetida")
        }

    }
}