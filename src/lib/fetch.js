const fetch = require('node-fetch');
const config = require('../../config');
const { json } = require('body-parser');
const env = process.env.NODE_ENV || 'production';
const port = config[env].server.port
const host = config[env].server.host
const url = `http://${host}:${port}/api`

module.exports = {
    async entradaOperarioPuesto(idOperario, idPuesto) {
        try {
            if (!isNaN(idOperario)) {
                idOperario = 'B00' + idOperario
            }
            let body = {
                method: 'post',
                body: JSON.stringify({ codigoOperario: idOperario, idMaquina: idPuesto }),
                headers: { 'Content-Type': 'application/json' }
            }
            console.log(body)
            var response = await fetch(`${url}/operarios/entrada`,body)
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    },
    async salidaOperarioPuesto(idOperario, idPuesto) {
        try {
            if (!isNaN(idOperario)) {
                idOperario = 'B00' + idOperario
            }
            var response = await fetch(`${url}/operarios/salida`,
                {
                    method: 'post',
                    body: JSON.stringify({ codigoOperario: idOperario, idMaquina: idPuesto }),
                    headers: { 'Content-Type': 'application/json' }
                })
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    },
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
    async buscarPrepaquete(codigoPrepaquete, codigoSeccion) {
        try {
            var response = await fetch(`${url}/prepaquetes/${codigoPrepaquete}/${codigoSeccion}`)
            var prepaquetes = await response.json()
            return prepaquetes
        } catch (err) {
            console.error(err)
            return null
        }
    }
}
