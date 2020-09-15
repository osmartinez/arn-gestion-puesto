const genericWebservice = require('./generic.ws')()
const wsName = 'operarios'

function OperarioWebservice() {
    
    async function buscar(id) {
        try {
            if (!isNaN(id)) {
                id = 'B00' + id
            }
            var response = await genericWebservice.get(wsName,id)
            var user = await response.json()
            return user
        } catch (err) {
            console.error(err)
            return null
        }
    }
    
    return {
        buscar,
    }
}

module.exports = OperarioWebservice