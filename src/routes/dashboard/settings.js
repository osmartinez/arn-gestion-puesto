const configParams = require('../../lib/config.params')
const { response } = require('express')
const config = require('../../../config')
const puestoWebservice = require('../../lib/repository/puesto.ws')()
const maquinaWebService = require('../../lib/repository/maquina.ws')()
const seccionWebService = require('../../lib/repository/seccion.ws')()

module.exports = function (router) {
    router.get('/settings', async (req, res) => {
        const puestos = await puestoWebservice.obtenerTodos()
        const puesto = configParams.read()
        res.render('dashboard/settings/index', { layout: 'main-dashboard', puesto: puesto, puestos: puestos })
    })

    router.post('/settings/buscarPuestoPorId', async (req, res) => {
        const { idPuesto } = req.body
        const puesto = await puestoWebservice.obtenerPorId(idPuesto)
        puesto.PuestosConfiguracionesIncidencias = await puestoWebservice.obtenerConfiguracionesIncidencias(idPuesto)
        puesto.PuestosConfiguracionesPins = await puestoWebservice.obtenerConfiguracionesPins(idPuesto)
        puesto.Maquinas = await puestoWebservice.obtenerMaquinas(idPuesto)
        res.json(puesto)
    })

    router.post('/settings/buscarMaquina', async (req, res) => {
        const { codigoMaquina } = req.body
        var maquina = await maquinaWebService.buscarPorCodigo(codigoMaquina)
        res.json(maquina)
    })

    router.post('/settings/maquinasEnSeccion', async (req, res) => {
        const { codSeccion } = req.body
        var maquinas = await maquinaWebService.buscarEnSeccion(codSeccion)
        res.json(maquinas)
    })

    router.post('/settings/configurarPaquetes', async (req, res) => {
        try {
            const { Id, ContadorPaquetes, EsContadorPaquetesAutomatico } = req.body
            let puesto = await puestoWebservice.obtenerPorId(Id)
            if (puesto == null || !puesto.Id) {
                return res.status(404).json({
                    message: 'No hay puesto configurado'
                })
            }
            else {
                await puestoWebservice.crear(puesto.Descripcion, puesto.Observaciones,
                    puesto.PinBuzzer, puesto.PinLed, Number(ContadorPaquetes),
                    EsContadorPaquetesAutomatico)
                puesto = await puestoWebservice.obtenerPorId(Id)
                configParams.write(puesto)
                res.json(puesto)
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }


    })

    router.post('/settings', async (req, res) => {
        const puesto = req.body

        // si tengo que crear un puesto
        if (puesto.CrearNuevo) {

            // lo creo
            const puestoNuevo = await puestoWebservice.crear(puesto.Descripcion, puesto.Observaciones,
                puesto.PuestosConfiguracionesPins.PinBuzzer, puesto.PuestosConfiguracionesPins.PinLed, puesto.PuestosConfiguracionesPins.ContadorPaquetes,
                puesto.PuestosConfiguracionesPins.EsContadorPaquetesAutomatico)
            // si se ha creado correctamente
            if (puestoNuevo != null && puestoNuevo.Id > 0) {
                // para cada máquina en el puesto a configurar
                for (const maquina of puesto.Maquinas) {
                    // actualizo los pines de la configuración de la máquina y machaco la lista de las maquinas del nuevo puesto con una recuperación renovada de las mismas
                    await maquinaWebService.actualizarConfiguracionPines(maquina.ID, maquina.EsPulsoManual, maquina.ProductoPorPulso, maquina.PinPulso, maquina.DescontarAutomaticamente)
                    puestoNuevo.Maquinas = await maquinaWebService.asociarAPuesto(maquina.ID, puestoNuevo.Id)
                }

                // para cada incidencia en el puesto a configurar
                for (const incidencia of puesto.PuestosConfiguracionesIncidencias) {
                    // actualizo la incidencia y aprovecho para machacar todas las incidencias del nuevo puesto con información renovada
                    puestoNuevo.PuestosConfiguracionesIncidencias = await puestoWebservice.actualizarIncidencia(incidencia.Id, incidencia.Nombre, incidencia.Habilitada,
                        incidencia.PinNotificacion1, incidencia.PinNotificacion2, incidencia.AvisarA, incidencia.Corregible,
                        incidencia.SegundosEjecucion, puestoNuevo.Id)
                }
            }
            configParams.write(puestoNuevo)
        }
        // el puesto ya existe, solo actualizar
        else {
            if (puesto.Id > 0) {
                // saco todas las maquinas del puesto
                await maquinaWebService.desasociarPuesto(puesto.Id)

                for (const maquina of puesto.Maquinas) {
                    // actualizo los pines de la configuración de la máquina y machaco la lista de las maquinas del nuevo puesto con una recuperación renovada de las mismas
                    await maquinaWebService.actualizarConfiguracionPines(maquina.ID, maquina.EsPulsoManual, maquina.ProductoPorPulso, maquina.PinPulso)
                    puesto.Maquinas = await maquinaWebService.asociarAPuesto(maquina.ID, puesto.Id)
                }
                for (const incidencia of puesto.PuestosConfiguracionesIncidencias) {
                    // actualizo la incidencia y aprovecho para machacar todas las incidencias del nuevo puesto con información renovada
                    puesto.PuestosConfiguracionesIncidencias = await puestoWebservice.actualizarIncidencia(incidencia.Id, incidencia.Nombre, incidencia.Habilitada,
                        incidencia.PinNotificacion1, incidencia.PinNotificacion2, incidencia.AvisarA, incidencia.Corregible,
                        incidencia.SegundosEjecucion, puesto.Id)
                }

                configParams.write(puesto)
            }
        }
    })

    router.post('/settings/secciones', async (req, res) => {
        const secciones = await seccionWebService.buscarTodas()
        res.json(secciones)
    })
}