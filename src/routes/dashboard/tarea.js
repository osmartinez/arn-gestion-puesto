const configParams = require('../../lib/config.params')
const PuestoTareasActuales = require('../../lib/model/puestoTareasActuales.model')
const Puesto = require('../../lib/model/puesto.model')
const Tarea = require('../../lib/model/tarea.model')
const Maquina = require('../../lib/model/maquina.model')
const Operario = require('../../lib/model/operario.model')
const Etiqueta = require('../../lib/model/etiqueta.model')
const Prepaquete = require('../../lib/model/prepaquete.model')
const MovimientoOperario = require('../../lib/model/movimientoOperario.model')
const Helpers = require('../../lib/helpers')
const mongoose = require('mongoose')
const puestoWebService = require('../../lib/repository/puesto.ws')()
const prepaqueteWebService = require('../../lib/repository/prepaquete.ws')()

module.exports = function (router) {
    router.get('/tarea', (req, res) => {
        res.render('dashboard/tarea/index', { layout: 'main-dashboard' })
    })

    router.post('/tarea/obtenerPuesto',async(req,res)=>{
        try {
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                puesto.TareasPuesto = puestoTareaActual
                res.json(puesto)
            }
        }catch(err){
            console.error(err)
            res.status(500).json({
                message:err
            })
        }
    })

    router.post('/tarea/pulsoSimulado', async (req,res)=>{
        try {
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                if (puestoTareaActual == null) {
                    res.status(500).json({
                        message: 'No hay puesto actual!'
                    })
                }
                else{
                    const productoPorPulso = 1
                    for(const tarea of puestoTareaActual.tareas){
                        if(tarea.cantidadFabricadaConfirmada < tarea.cantidadFabricar){
                            tarea.cantidadFabricadaConfirmada += productoPorPulso
                            await puestoTareaActual.save()
                            break
                        }
                    }
                    return res.json(puestoTareaActual)
                }
            }
        }catch(err){
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    router.post('/tarea/ficharCaja', async (req, res) => {
        const { codigoEtiqueta } = req.body
        try {
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                if (puestoTareaActual == null) {
                    const maquinasNuevas = []
                    for (const maquina of puesto.Maquinas) {
                        maquinasNuevas.push(new Maquina({
                            idSql: maquina.ID,
                            nombre: maquina.Nombre,
                            codigoEtiqueta: maquina.CodigoEtiqueta,
                        }))
                    }

                    const puestoNuevo = new Puesto({
                        idSql: puesto.Id,
                        descripcion: puesto.Descripcion,
                        observaciones: puesto.Observaciones,
                        maquinas: maquinasNuevas
                    })

                    const operariosNuevo = []
                    const operariosActuales = await puestoWebService.buscarOperariosActuales(puesto.Id)
                    for (const operario of operariosActuales) {
                        operariosNuevo.push(new Operario({
                            idSql: operario.IdOperario,
                            codigoObrero: operario.CodigoObrero,
                            codigoEtiqueta: operario.CodigoEtiqueta,
                            fechaEntrada: operario.FechaEntradaReal,
                        }))
                    }

                    const movimientoOperarioNuevo = new MovimientoOperario({
                        operariosActuales: operariosNuevo,
                    })

                    const prepaquetesNuevos = []
                    for (const maquina of puesto.Maquinas) {
                        const prepaquetesResponse = await prepaqueteWebService.buscarPrepaquete(codigoEtiqueta, maquina.CodSeccion)
                        for (const pre of prepaquetesResponse) {
                            prepaquetesNuevos.push(new Prepaquete({
                                codigoEtiqueta: pre.CodigoEtiqueta,
                                codSeccion: maquina.CodSeccion,
                                cantidad: pre.Cantidad,
                                talla: pre.Talla,
                                codigoOrden: pre.Codigo,
                                cliente: pre.NOMBRECLI.trim(),
                                modelo: pre.DESCRIPCIONARTICULO.trim(),
                                referencia: pre.CodigoArticulo,
                                utillaje: pre.CodUtillaje,
                                tallasArticulo: pre.Tallas.split(','),
                                tallaUtillaje: pre.IdUtillajeTalla,
                                cantidadFabricar: pre.CantidadFabricar,
                                cantidadFabricada: pre.CantidadFabricada,
                                descripcionOperacion: pre.Descripcion,
                                pedidoLinea: pre.PedidoLinea,
                                idTarea: pre.IdTarea,
                            }))
                        }
                    }

                    const gruposPrepaquetes = Helpers.groupBy(prepaquetesNuevos, 'idTarea')
                    /*
                        {
                            123312: [{codigoEtiqueta: '...', cantidad: 100}, ...]
                            123313: [{...},...]
                        }
                    */

                    const tareasNuevas = []
                    for (const key in gruposPrepaquetes) {
                        const prepaqueteAux = gruposPrepaquetes[key][0]
                        const etiquetaNueva = new Etiqueta({
                            codigoEtiqueta: codigoEtiqueta,
                            esAgrupacion: codigoEtiqueta.startsWith('11'),
                            prepaquetes: gruposPrepaquetes[key],
                            codSeccion: prepaqueteAux.codSeccion,
                        })

                        const tareaNueva = new Tarea({
                            idSql: key,
                            etiquetas: [etiquetaNueva],
                            utillaje: prepaqueteAux.utillaje,
                            tallaUtillaje: prepaqueteAux.tallaUtillaje,
                            tallasArticulo: prepaqueteAux.tallasArticulo,
                            cantidadFabricar: prepaqueteAux.cantidadFabricar,
                            cantidadSaldos: -1,
                            cantidadFabricada: prepaqueteAux.cantidadFabricada,
                            modelo: prepaqueteAux.modelo,
                            cliente: prepaqueteAux.cliente,
                            referencia: prepaqueteAux.referencia,
                            codigoOrden: prepaqueteAux.codigoOrden,
                        })
                        tareasNuevas.push(tareaNueva)
                    }

                    puestoTareaActual = new PuestoTareasActuales({
                        _id: new mongoose.Types.ObjectId(),
                        tareas: tareasNuevas,
                        puesto: puestoNuevo,
                        movimientosOperarios: [movimientoOperarioNuevo]
                    })

                    await puestoTareaActual.save()

                    res.json(puestoTareaActual)
                }
                else {
                    // si hay tareas en marcha
                    res.json(puestoTareaActual)
                }
            }


        } catch (err) {
            console.error(err)
            res.status(500).json({
                'message': err
            })
        }

    })
}