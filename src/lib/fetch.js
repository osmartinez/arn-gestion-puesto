const fetch = require('node-fetch');
const config = require('../../config')
const env = process.env.NODE_ENV || 'production';
const port = config[env].server.port
const host = config[env].server.host
const url = `http://${host}:${port}/api`

module.exports = {
    async buscarMaquina(codigoMaquina){
        try{
            var response = await fetch (`${url}/maquinas/${codigoMaquina}`)
            var maquina = await response.json()
            return maquina
        }catch(err){
            console.error(err)
            return null
        }
    },
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
            var response = await fetch(`${url}/ordenesFabricacion/buscarOperacion/${id}/${codSeccion}`)
            var operaciones = await response.json()
            return operaciones
        }catch(err){
            console.error(err)
            return null
        }
    },

    async buscarTodasSecciones(){
        try{
            var response = await fetch(`${url}/secciones`)
            var secciones = await response.json()
            return secciones
        }
        catch(err){
            console.error(err)
            return null
        }
    },

    async buscarMaquinasEnSeccion(codSeccion){
        try{
            var response = await fetch(`${url}/maquinas/enSeccion/${codSeccion}`)
            var maquinas = await response.json()
            return maquinas
        }catch(err){
            console.error(err)
            return null
        }
    }
}