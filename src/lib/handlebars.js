
const configParams = require('./config.params')
const {buscarMaquina} =  require('./fetch')

module.exports = {
    gt(a,b){
        return a>b
    },
    eq(a,b){
        return a<b
    },
    isSelected(value,key){
       return String(value) === String(key)? 'selected': ''
    },

    nombreMaquina(){
        var nombre =  configParams.read().puesto.maquina.Nombre
        return nombre
    }
}