const genericWebservice = require('./generic.ws')()
const wsName = 'ordenesFabricacion'

function OrdenFabricacionWebservice() {
    
    async function buscarOperacionesEnSeccion(id,codSeccion){
        try{
            const resp = await genericWebservice.get(wsName,id,codSeccion)
            const operaciones = await resp.json()
            return operaciones
        }catch(err){
            console.err(err)
        }
        return null
    }
    
    return {
        buscarOperacionesEnSeccion,

    }
}

module.exports = OrdenFabricacionWebservice