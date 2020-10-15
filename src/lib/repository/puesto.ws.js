const genericWebservice = require('./generic.ws')()
const wsName = 'puestos'

function PuestoWebservice() {
    async function crear(descripcion, observaciones,pinBuzzer,pinLed, contadorPaquetes, esContadorPaquetesAutomatico,esManual) {
        try {
            const resp1 = await genericWebservice.get(wsName, 'buscarPorDescripcion', descripcion)
            const puestos = await resp1.json()
            if(puestos.length == 0){
                const resp2 =await genericWebservice.post({
                    descripcion: descripcion==null?'':descripcion,
                    observaciones: observaciones==null?'':observaciones,
                    pinBuzzer:pinBuzzer==null?'null':pinBuzzer,
                    pinLed:pinLed==null?'null':pinLed,
                    contadorPaquetes: contadorPaquetes==null?0:contadorPaquetes,
                    esContadorPaquetesAutomatico: esContadorPaquetesAutomatico==null?true:esContadorPaquetesAutomatico,
                    esManual: esManual==null?false:esManual,
                },wsName,'crear')
                const puesto = await resp2.json()
                if(puesto.Id){
                    return puesto
                }
            }
            else if(puestos.length== 1){
                const resp2 = await genericWebservice.post({
                    id: puestos[0].Id,
                    descripcion: descripcion==null?'':descripcion,
                    observaciones: observaciones==null?'':observaciones,
                    pinBuzzer:pinBuzzer==null?'null':pinBuzzer,
                    pinLed:pinLed==null?'null':pinLed,
                    contadorPaquetes: contadorPaquetes==null?0:contadorPaquetes,
                    esContadorPaquetesAutomatico: esContadorPaquetesAutomatico==null?true:esContadorPaquetesAutomatico,
                    esManual: esManual==null?false:esManual,
                },wsName,'actualizar')
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

    async function actualizarIncidencia(id, nombre, habilitada,pinNotificacion1, pinNotificacion2,avisarA,corregible,segundosEjecucion,idPuesto,bloqueante){
        try {
            const resp1 = await genericWebservice.post({
                id:id,
                nombre:nombre,
                habilitada:habilitada == null ? false: habilitada,
                pinNotificacion1:pinNotificacion1 == null? 'null':pinNotificacion1,
                pinNotificacion2:pinNotificacion2 == null? 'null': pinNotificacion2,
                avisarA:avisarA==null?'NADIE':avisarA,
                corregible:corregible==null?false:corregible,
                segundosEjecucion:segundosEjecucion==null?0:segundosEjecucion,
                idPuesto:idPuesto,
                bloqueante: bloqueante == null?false:bloqueante
            },wsName, 'actualizarIncidencia')
            const incidencias = await resp1.json()
            if(incidencias.length > 0){
               return incidencias
            }
            return null

        } catch (err) {
            console.error(err)
            return null
        }
    }

    async function obtenerTodos(){
        try{
            const resp = await genericWebservice.get(wsName)
            const puestos = await resp.json()
            return puestos
        }
        catch(err){
            console.error(err)
            return null
        }
    }

    async function obtenerPorId(id){
        try{
            const resp =await genericWebservice.get(wsName, id)
            const puesto = await resp.json()
            return puesto
        }catch(err){
            console.log(err)
            return null
        }
    }

    async function obtenerConfiguracionesIncidencias(id){
        try{
            const resp =await genericWebservice.get(wsName,'obtenerConfiguracionesIncidencias', id)
            const incidencias = await resp.json()
            return incidencias
        }catch(err){
            console.log(err)
            return null
        }
    }

    async function obtenerConfiguracionesPins(id){
        try{
            const resp =await genericWebservice.get(wsName,'obtenerConfiguracionesPins', id)
            const incidencias = await resp.json()
            return incidencias
        }catch(err){
            console.log(err)
            return null
        }
    }

    async function obtenerMaquinas(id){
        try{
            const resp =await genericWebservice.get(wsName,'obtenerMaquinas', id)
            const maquinas = await resp.json()
            return maquinas
        }catch(err){
            console.log(err)
            return null
        }
    }

    function reconstruirCodigoObrero(codigo){
        if (!isNaN(codigo)) {
            codigo = 'B00' + codigo
        }
        return codigo
    }

    async function entradaOperarioPorCodigoObrero(id, codigoObrero){
        try{
            const resp = await genericWebservice.post({
                codigoObrero: reconstruirCodigoObrero(codigoObrero),
                idPuesto: id
            },wsName,'entradaOperarioPorCodigoObrero')
            const operarios = await resp.json()
            return operarios
        }catch(err){
            console.error(err)
        }
        return null
    }

    
    async function salidaOperarioPorCodigoObrero(id, codigoObrero){
        try{
            const resp = await genericWebservice.post({
                codigoObrero: codigoObrero,
                idPuesto: id
            },wsName,'salidaOperarioPorCodigoObrero')
            const operarios = await resp.json()
            return operarios
        }catch(err){
            console.error(err)
        }
        return null
    }

    async function buscarOperariosActuales(id){
        try{
            const resp = await genericWebservice.get(wsName,'buscarOperariosActuales',id)
            const operarios = await resp.json()
            return operarios
        }catch(err){
            console.error(err)
        }
        return null
    }

    return {
        crear,
        actualizarIncidencia,
        obtenerTodos,
        obtenerPorId,
        obtenerConfiguracionesIncidencias,
        obtenerConfiguracionesPins,
        obtenerMaquinas,
        entradaOperarioPorCodigoObrero,
        salidaOperarioPorCodigoObrero,
        buscarOperariosActuales,

    }
}

module.exports = PuestoWebservice