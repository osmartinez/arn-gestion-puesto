const genericWebservice = require('./generic.ws')()
const wsName = 'secciones'

function SeccionWebservice() {
    
    async function buscarTodas(){
        try{
            const resp = await genericWebservice.get(wsName)
            const secciones = await resp.json()
            return secciones
        }catch(err){
            console.err(err)
        }
        return null
    }

    async function buscarPorCodigo(codSeccion){
        try{
            const resp = await genericWebservice.get(wsName,codSeccion)
            const seccion = await resp.json()
            return seccion
        }catch(err){
            console.err(err)
        }
        return null
    }
    
    return {
        buscarTodas,
        buscarPorCodigo,
    }
}

module.exports = SeccionWebservice