const genericWebservice = require('./generic.ws')()
const wsName = 'ordenesFabricacion'

function OrdenFabricacionWebservice() {
    
    async function buscarOperacionesEnSeccion(id,codSeccion){
        try{
            const resp = await genericWebservice.get(wsName,'buscarOperacionesEnSeccion',id,codSeccion)
            const operaciones = await resp.json()
            return operaciones
        }catch(err){
            console.error(err)
        }
        return null
    }
    
    return {
        buscarOperacionesEnSeccion,

    }
}

module.exports = OrdenFabricacionWebservice()