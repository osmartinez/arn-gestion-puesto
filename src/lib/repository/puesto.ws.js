const genericWebservice = require('./generic.ws')()
const wsName = 'puestos'

function PuestoWebservice() {
    async function crear(descripcion, observaciones,pinBuzzer,pinLed) {
        try {
            const resp1 = await genericWebservice.get(wsName, 'buscarPorDescripcion', descripcion)
            const puestos = await resp1.json()
            if(puestos.length == 0){
                const resp2 =await genericWebservice.post({
                    descripcion: descripcion,
                    observaciones: observaciones,
                    pinBuzzer:pinBuzzer,
                    pinLed:pinLed,
                },wsName,'crear')
                const puesto = await resp2.json()
                if(puesto.Id){
                    return puesto
                }
            }
            return null

        } catch (err) {
            console.error(err)
            return null
        }
    }

    return {
        crear,
    }
}

module.exports = PuestoWebservice