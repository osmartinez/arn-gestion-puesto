const configParams = require('../../lib/config.params')

const PuestoTareasActuales = require('../../lib/model/puestoTareasActuales.model')
const Puesto = require('../../lib/model/puesto.model')
const Tarea = require('../../lib/model/tarea.model')
const Maquina = require('../../lib/model/maquina.model')
const Etiqueta = require('../../lib/model/etiqueta.model')
const Prepaquete = require('../../lib/model/prepaquete.model')
const MovimientoPulso = require('../../lib/model/movimientoPulso.model')
const MovimientoOperario = require('../../lib/model/movimientoOperario.model')
const Paquete = require('../../lib/model/paquete.model')

const Helpers = require('../../lib/helpers')
const mongoose = require('mongoose')
const puestoWebService = require('../../lib/repository/puesto.ws')()
const prepaqueteWebService = require('../../lib/repository/prepaquete.ws')()

module.exports = function (router) {
    router.get('/tarea', (req, res) => {
        res.render('dashboard/tarea/index', { layout: 'main-dashboard' })
    })

    router.post('/tarea/terminar', async (req, res) => {
        try {
            const { defectuosas } = req.body
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                if (puestoTareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    puestoTareaActual.fechaFin = new Date()
                    puestoTareaActual.terminado = true
                    await puestoTareaActual.save()
                    puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                    res.json(puestoTareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    router.post('/tarea/actualizarDefectuosas', async (req, res) => {
        try {
            const { defectuosas } = req.body
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                if (puestoTareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    for (const tarea of puestoTareaActual.tareas) {
                        if ((tarea.cantidadFabricadaPuesto.sum('cantidad')
                            + tarea.cantidadDefectuosaPuesto.sum('cantidad')) < tarea.cantidadFabricar) {
                            tarea.cantidadDefectuosaPuesto.push(new MovimientoPulso({
                                cantidad: Number(defectuosas)
                            }))
                            break;
                        }
                    }
                    await puestoTareaActual.save()
                    res.json(puestoTareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    router.post('/tarea/actualizarSaldos', async (req, res) => {
        try {
            const { saldos } = req.body
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                if (puestoTareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    for (const tarea of puestoTareaActual.tareas) {
                        if ((tarea.cantidadFabricadaPuesto.sum('cantidad')
                            + tarea.cantidadDefectuosaPuesto.sum('cantidad')) < tarea.cantidadFabricar) {
                            tarea.cantidadSaldosPuesto.push(new MovimientoPulso({
                                cantidad: Number(saldos)
                            }))
                            break;
                        }
                    }
                    await puestoTareaActual.save()
                    res.json(puestoTareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    router.post('/tarea/obtenerPuesto', async (req, res) => {
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
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    router.post('/tarea/pulsoMaquina',async(req,res)=>{
        const {idMaquina} = req.body
        try{
            const puesto = configParams.read()
            if(puesto==null || !puesto.Id){
                return res.status(404).json({
                    message: 'No hay puesto configurado'
                })
            }
            
            const maquina = puesto.Maquinas.find(m=>m.ID == idMaquina)
            if(maquina == null || maquina.EsPulsoManual){
                return res.status(404).json({
                    message: 'No existe la maquina con pulso automatico en el puesto configurado'
                })
            }
            else{
                let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                if(puestoTareaActual== null){
                    return res.status(404).json({
                        message: 'No hay tarea en el puesto'
                    })
                }
                else{
                    await consumirPulso(maquina.ProductoPorPulso, puestoTareaActual,puesto)
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

    async function consumirPulso(cuantosPares, puestoTareaActual,puesto){
        for (const tarea of puestoTareaActual.tareas) {
            if (tarea.cantidadFabricadaPuesto.sum('cantidad') < tarea.cantidadFabricar) {
                tarea.cantidadFabricadaPuesto.push(new MovimientoPulso({
                    cantidad: cuantosPares
                }))


                let paqueteModificar = tarea.paquetes.find(p => p.cerrado == false)
                if (paqueteModificar == null) {
                    tarea.paquetes.push(new Paquete({
                        cantidad: cuantosPares,
                    }))
                }
                else {
                    paqueteModificar.cantidad += cuantosPares
                    if (puesto.EsContadorPaquetesAutomatico) {
                        if (paqueteModificar.cantidad >= puesto.ContadorPaquetes) {
                            paqueteModificar.cerrado = true
                        }
                    }
                }

                await puestoTareaActual.save()
                break
            }
        }
    }

    router.post('/tarea/pulsoSimulado', async (req, res) => {
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
                else {
                    const productoPorPulso = 1
                    consumirPulso(productoPorPulso, puestoTareaActual,puesto)
                    return res.json(puestoTareaActual)
                }
            }
        } catch (err) {
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
                const operariosActuales = await MovimientoOperario.find({ idPuestoSql: puesto.Id, fechaSalida: null })
                if (operariosActuales == null || operariosActuales.length == 0) {
                    return res.status(405).json({
                        message: 'No hay ningún operario registrado'
                    })
                }

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



                    const prepaquetesNuevos = []
                    for (const maquina of puesto.Maquinas) {
                        const prepaquetesResponse = await prepaqueteWebService.buscarPrepaquete(codigoEtiqueta, maquina.CodSeccion)
                        if (prepaquetesResponse == null || prepaquetesResponse.length == 0) {
                            return res.status(404).json({
                                message: 'No existe la etiqueta'
                            })
                        }

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
                    })

                    await puestoTareaActual.save()

                    res.json(puestoTareaActual)
                }
                else {
                    // si hay tareas en marcha

                    const prepaquetesNuevos = []
                    for (const maquina of puesto.Maquinas) {
                        const prepaquetesResponse = await prepaqueteWebService.buscarPrepaquete(codigoEtiqueta, maquina.CodSeccion)
                        if (prepaquetesResponse == null || prepaquetesResponse.length == 0) {
                            return res.status(404).json({
                                message: 'No existe la etiqueta'
                            })
                        }
                        else {
                            const posibleIncompatibilidad = puestoTareaActual.tareas.find(x => x.utillaje == prepaquetesResponse[0].CodUtillaje
                                && x.tallaUtillaje == prepaquetesResponse[0].IdUtillajeTalla)

                            if (posibleIncompatibilidad == null) {
                                return res.status(403).json({
                                    message: 'No puedes meter una caja con otra configuración de utillaje, finaliza antes'
                                })
                            }
                        }

                        // la etiqueta se ha leido correctamente y no hay incompatibilidad entre las tareas
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

                        const tareaExistente = puestoTareaActual.tareas.find(x => x.idSql == key)
                        if (tareaExistente == null) {
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
                        else {
                            console.log(tareaExistente.etiquetas)
                            console.log(etiquetaNueva.codigoEtiqueta)
                            const etiquetaExistente = tareaExistente.etiquetas.find(x => x.codigoEtiqueta == etiquetaNueva.codigoEtiqueta)
                            if (etiquetaExistente == null) {
                                tareaExistente.etiquetas.push(etiquetaNueva)
                            }
                        }
                    }

                    await puestoTareaActual.save()

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

    router.post('/tarea/normalizarPaquetes', async (req, res) => {
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
                else {
                    for (const tarea of puestoTareaActual.tareas) {
                        if (tarea.cantidadFabricadaPuesto.sum('cantidad') < tarea.cantidadFabricar) {
                            let paqueteNormalizar= tarea.paquetes.find(p => p.cerrado == false)
                            if (paqueteNormalizar == null) {
                                tarea.paquetes.push(new Paquete({
                                    cantidad: 0,
                                }))
                            }
                            else {
                                if(paqueteNormalizar.cantidad<puesto.ContadorPaquetes){
                                    res.status(403).json({
                                        message: 'No puedes cerrar un paquete que no ha llegado al mínimo'
                                    })
                                }
                                else{
                                    paqueteNormalizar.cerrado = true
                                    const cantidadNormalizar = paqueteNormalizar.cantidad - puesto.ContadorPaquetes
                                    paqueteNormalizar.cantidad -=cantidadNormalizar
                                    tarea.paquetes.push(new Paquete({
                                        cantidad: cantidadNormalizar,
                                    }))
                                }

                            }

                            break
                        }
                    }

                    await puestoTareaActual.save()
                    return res.json(puestoTareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })
}