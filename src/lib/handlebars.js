
const configParams = require('./config.params')
const { buscarMaquina } = require('./fetch')

module.exports = {
    gt(a, b) {
        return a > b
    },
    lt(a, b) {
        return a < b
    },
    eq(a, b) {
        return a == b
    },
    isChecked(value, key) {
        return value == key ? 'checked' : ''
    },
    isSelected(value, key) {
        return String(value) === String(key) ? 'selected' : ''
    },

    nombreMaquina() {
        var puesto = configParams.read()
        var nombre = ''
        if(puesto!= null){
            nombre = puesto.Descripcion
        }
        return nombre
    },
    buildTablaIncidencias(incidencias) {
        let filas = ''
        let fila = ''
        let html = ''
        let numIncidenciasPorFila = 2
        let contadorIncidenciasPorFila = 0

        if (incidencias != null && incidencias.length > 0) {
            for (const incidencia of incidencias) {
                if (incidencia.Habilitada) {
                    if (contadorIncidenciasPorFila == numIncidenciasPorFila) {
                        contadorIncidenciasPorFila = 0
                        filas += `<tr>${fila}</tr>`
                        fila = ''
                    }
                    else {
                        fila += `
                        <td>
                            <div class="btn btn-warning btn-lg" onclick="registrarIncidencia('${incidencia.Id}')">
                                <span>${incidencia.Nombre}</span>
                            </div>
                        </td>`
                        contadorIncidenciasPorFila++
                    }
                }
            }

            if (fila != '') {
                filas += `<tr>${fila}</tr>`
                fila = ''
            }

            html = `<table class="matrix">${filas}</table>`
        }

        return html
    }
}