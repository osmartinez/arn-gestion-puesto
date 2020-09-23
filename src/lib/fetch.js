const fetch = require('node-fetch');
const config = require('../../config');
const env = process.env.NODE_ENV || 'production';
const port = config[env].rest.port
const host = config[env].rest.host
const url = `http://${host}:${port}/api`

module.exports = {
   
    async buscarOrden(id) {
        try {
            var response = await (fetch(`${url}/ordenesFabricacion/${id}`))
            var orden = await response.json()
            return orden
        } catch (err) {
            console.error(err)
            return null
        }
    },
    async buscarOperacion(id, codSeccion) {
        try {
            var response = await fetch(`${url}/ordenesFabricacion/buscarOperacion/${id}/${codSeccion}`)
            var operaciones = await response.json()
            return operaciones
        } catch (err) {
            console.error(err)
            return null
        }
    },
    async buscarOperaciones(idOrden) {
        try {
            var response = await fetch(`${url}/ordenesFabricacion/buscarOperaciones/${idOrden}`)
            var operaciones = await response.json()
            return operaciones
        } catch (err) {
            console.error(err)
            return null
        }
    },
    async buscarOperacionesTallas(idOperacion){
        try {
            var response = await fetch(`${url}/ordenesFabricacion/buscarOperacionesTallas/${idOperacion}`)
            var operacionesTallas = await response.json()
            return operacionesTallas
        } catch (err) {
            console.error(err)
            return null
        }
    },
    
}
