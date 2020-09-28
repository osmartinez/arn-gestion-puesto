const genericWebservice = require('./generic.ws')()
const wsName = 'operarios'

function OperarioWebservice() {
    
    async function buscar(id) {
        try {
           
            var response = await genericWebservice.get(wsName,id)
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    }

    async function buscarPorCodigo(codigo) {
        try {
            if (!isNaN(codigo)) {
                codigo = 'B00' + codigo
            }
            var response = await genericWebservice.get(wsName,"buscarPorCodigo",codigo)
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    }
    
    return {
        buscar,
        buscarPorCodigo,
    }
}

module.exports = OperarioWebservice