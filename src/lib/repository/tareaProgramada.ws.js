const genericWebservice = require('./generic.ws')()
const wsName = 'tareasProgramadas'

function TareaProgramadaWebservice() {
    async function consumirEnPuesto(idTarea,cantidad,idMaquina) {
        try {
            const resp = await genericWebservice.post({
                idTarea: idTarea,
                cantidad:cantidad,
                idMaquina:idMaquina
            },wsName,'consumirEnPuesto')
            const resultado = await resp.json()
            return resultado
        } catch (err) {
            console.error(err)
            return null
        }
    }


    return {
        consumirEnPuesto

    }
}

module.exports = TareaProgramadaWebservice