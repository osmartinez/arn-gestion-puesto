const genericWebservice = require('./generic.ws')()
const wsName = 'prepaquetes'

function PrepaqueteWebservice() {
    
    async function buscarPrepaquete(codigoPrepaquete, codigoSeccion) {
        try {
            var response = await genericWebservice.get(wsName,codigoPrepaquete,codigoSeccion)
            var prepaquetes = await response.json()
            return prepaquetes
        } catch (err) {
            console.error(err)
            return null
        }
    }
    
    return {
        buscarPrepaquete
    }
}

module.exports = PrepaqueteWebservice()