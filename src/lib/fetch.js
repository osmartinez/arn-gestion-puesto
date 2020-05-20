const fetch = require('node-fetch');
const config = require('../../config')
const env = process.env.NODE_ENV || 'production';
const port = config[env].server.port
const host = config[env].server.host
const url = `http://${host}:${port}/api`

module.exports = {
    async buscarOperario(id){
        try{
            var response = await fetch(`${url}/operarios/${id}`)
            var user = await response.json()
            return user
        }catch(err){
            console.error(err)
            return null
        }
    },

    async buscarOrden(id){
        try{
            var response = await(fetch(`${url}/ordenesFabricacion/${id}`))
            var orden = await response.json()
            return orden
        }catch(err){
            console.error(err)
            return null
        }
    },

    async buscarOperacion(id, codSeccion){
        try{
            var response = await(fetch(`${url}/ordenesFabricacion/buscarOperacion/${id}/${codSeccion}`))
            var operaciones = await response.json()
            return operaciones
        }catch(err){
            console.error(err)
            return null
        }
    }
}