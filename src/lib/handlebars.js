
const configParams = require('./config.params')
const {buscarMaquina} =  require('./fetch')

module.exports = {
    gt(a,b){
        return a>b
    },
    lt(a,b){
        return a<b
    },
    eq(a,b){
        return a==b
    },
    isChecked(value,key){
        return value == key? 'checked': ''
    },
    isSelected(value,key){
       return String(value) === String(key)? 'selected': ''
    },

    nombreMaquina(){
        var nombre =  configParams.read().Descripcion
        return nombre
    },
    buildTablaIncidencias(incidencias){
        let html = ''
        for(const incidencia of incidencias){
            html+= `<button class="btn btn-warning btn-lg">${incidencia.Nombre}</button>`
        }
        return html
    }
}