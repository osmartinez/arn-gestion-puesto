const genericWebservice = require('./generic.ws')()
const wsName = 'maquinas'

function MaquinaWebservice() {
    async function asociarAPuesto(idMaquina, idPuesto) {
        try {
            const resp1 = await genericWebservice.post({
                idMaquina:idMaquina,
                idPuesto:idPuesto,
            },wsName, 'asociarAPuesto')
            const maquinas = await resp1.json()
            if(maquinas.length > 0){
                return maquinas
            }

        } catch (err) {
            console.error(err)
        }
        return null
    }

    async function buscarPorCodigo(codigo){
        try{
            const resp = await genericWebservice.get(wsName,codigo)
            const maquina = await resp.json()
            if(maquina.ID){
                return maquina
            }
        }catch(err){
            console.error(err)
        }
        return null

    }

    return {
        asociarAPuesto,
        buscarPorCodigo,
    }
}

module.exports = MaquinaWebservice