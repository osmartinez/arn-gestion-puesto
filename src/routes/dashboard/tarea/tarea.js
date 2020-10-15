const configParams = require('../../../lib/config.params')

var GpioConfiguracion =null
const Tarea = require('../../../lib/model/tarea.model')
const MovimientoPulso = require('../../../lib/model/movimientoPulso.model')
const MovimientoOperario = require('../../../lib/model/movimientoOperario.model')
const Paquete = require('../../../lib/model/paquete.model')
const DetalleTarea = require('../../../lib/model/detalleTarea.model')

const Helpers = require('../../../lib/helpers')
const mongoose = require('mongoose')

const puestoWebService = require('../../../lib/repository/puesto.ws')()
const prepaqueteWebService = require('../../../lib/repository/prepaquete.ws')()
const tareaProgramadaWebService = require('../../../lib/repository/tareaProgramada.ws')()
const device = process.env.DEVICE_ENV || 'raspi'
if(device == "raspi"){
    GpioConfiguracion = require('../../../lib/pins/gpio.config')
}

module.exports = function (router) {
    router.get('/tarea', (req, res) => {
        res.render('dashboard/tarea/index', { layout: 'main-dashboard' })
    })


    // actualizado
    async function consumirTareaEnSQL(tareaActual) {
        let cantidadFabricadaPuesto = tareaActual.cantidadFabricadaPuesto.sum('cantidad') + tareaActual.cantidadDefectuosaPuesto.sum('cantidad') - tareaActual.cantidadSaldosPuesto.sum('cantidad')
        let cantidadFabricadaPuestoAux = cantidadFabricadaPuesto

        if (tareaActual.detallesTarea.length == 1) {
            // solo tiene una OF (no es agrupacion)
            for (const maquina of puesto.Maquinas) {
                const resultadoConsumo = await tareaProgramadaWebService.consumirEnPuesto(tareaActual.detallesTarea[0].idSql, cantidadFabricadaPuesto, maquina.ID)
                console.log(resultadoConsumo)
            }
        }
        else {
            // es agrupacion, cuidado al consumir
            for (const detalle of tareaActual.detallesTarea) {
                if (cantidadFabricadaPuestoAux <= 0) break

                let cantidadConsumir = 0
                if (detalle.cantidadFabricar + detalle.cantidadSaldos <= cantidadFabricadaPuestoAux) {
                    cantidadConsumir = detalle.cantidadFabricar + detalle.cantidadSaldos
                    cantidadFabricadaPuestoAux -= detalle.cantidadFabricar + detalle.cantidadSaldos
                }
                else {
                    cantidadConsumir = cantidadFabricadaPuestoAux
                    cantidadFabricadaPuestoAux = 0
                }

                for (const maquina of puesto.Maquinas) {
                    const resultadoConsumo = await tareaProgramadaWebService.consumirEnPuesto(detalle.idSql, cantidadConsumir, maquina.ID)
                    console.log(resultadoConsumo)
                }
            }

        }

        await tareaActual.save()
    }

    // actualizado
    router.post('/tarea/terminarManual', async (req, res) => {
        try {
            const { fabricada, defectuosa, saldos } = req.body
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    tareaActual.fechaFin = Date.now()
                    tareaActual.terminado = true

                    tareaActual.cantidadFabricadaPuesto.push(new MovimientoPulso({
                        cantidad: Number(fabricada)
                    }))
                    tareaActual.cantidadDefectuosaPuesto.push(new MovimientoPulso({
                        cantidad: Number(defectuosa)
                    }))
                    tareaActual.cantidadSaldosPuesto.push(new MovimientoPulso({
                        cantidad: Number(saldos)
                    }))

                    await consumirTareaEnSQL(tareaActual)

                    tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                    res.json(tareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
    router.post('/tarea/terminar', async (req, res) => {
        try {
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    tareaActual.fechaFin = Date.now()
                    tareaActual.terminado = true
                    consumirTareaEnSQL(tareaActual)

                    tareaActual = await Tarea.findOne({ "puesto.idSql": puesto.Id, terminado: false })
                    res.json(tareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
    router.post('/tarea/actualizarDefectuosas', async (req, res) => {
        try {
            const { defectuosas } = req.body
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    tareaActual.cantidadDefectuosaPuesto.push(new MovimientoPulso({
                        cantidad: Number(defectuosas)
                    }))
                    await tareaActual.save()
                    res.json(tareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
    router.post('/tarea/actualizarSaldos', async (req, res) => {
        try {
            const { saldos } = req.body
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea cargada'
                    })
                }
                else {
                    tareaActual.cantidadSaldosPuesto.push(new MovimientoPulso({
                        cantidad: Number(saldos)
                    }))
                    await tareaActual.save()
                    res.json(tareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
    router.post('/tarea/obtenerPuesto', async (req, res) => {
        try {
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                puesto.TareasPuesto = tareaActual
                res.json(puesto)
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
    router.post('/tarea/pulsoMaquina', async (req, res) => {
        const { IdMaquina, PinPulso, ProductoPorPulso, EsPulsoManual } = req.body
        try {

            if (device == "raspi") {
                if (GpioConfiguracion.PINS[PinPulso].flanco == 'up') {
                    GpioConfiguracion.PINS[PinPulso].pulsesUp.pop()
                }
            }

            const puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                return res.status(404).json({
                    message: 'No hay puesto configurado'
                })
            }

            const operariosActuales = await MovimientoOperario.find({ idPuestoSql: puesto.Id, fechaSalida: null })
            if (operariosActuales == null || operariosActuales.length == 0) {
                return res.status(405).json({
                    message: 'No hay ningún operario registrado'
                })
            }

            let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
            if (tareaActual == null) {
                return res.status(404).json({
                    message: 'No hay tarea en el puesto'
                })
            }
            else {
                await consumirPulso(ProductoPorPulso, tareaActual, puesto)
                return res.json(tareaActual)
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }

    })

    // actualizado
    async function consumirPulso(cuantosPares, tareaActual, puesto) {
        // vamos a suponer por ahora que solo hay una tarea en el puesto
        tareaActual.cantidadFabricadaPuesto.push(new MovimientoPulso({
            cantidad: cuantosPares
        }))


        let paqueteModificar = tareaActual.paquetes.find(p => p.cerrado == false)
        if (paqueteModificar == null) {
            tareaActual.paquetes.push(new Paquete({
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

        await tareaActual.save()
    }
    // actualizado
    router.post('/tarea/pulsoSimulado', async (req, res) => {
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

                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    res.status(500).json({
                        message: 'No hay puesto actual!'
                    })
                }
                else {
                    const productoPorPulso = 1
                    consumirPulso(productoPorPulso, tareaActual, puesto)
                    return res.json(tareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
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

                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    const detalles = []
                    let utillaje = ''
                    let tallaUtillaje = ''

                    if (puesto.Maquinas == null || puesto.Maquinas.length == 0) {
                        return res.status(500).json({
                            message: 'No hay máquinas en el puesto'
                        })
                    }

                    const prepaquetesResponse = await prepaqueteWebService.buscarPrepaquete(codigoEtiqueta, puesto.Maquinas[0].CodSeccion)

                    if (prepaquetesResponse == null || prepaquetesResponse.length == 0) {
                        return res.status(404).json({
                            message: 'No existe la etiqueta'
                        })
                    }

                    for (const pre of prepaquetesResponse) {
                        //  globales
                        utillaje = pre.CodUtillaje
                        tallaUtillaje = pre.IdUtillajeTalla

                        detalles.push(new DetalleTarea({
                            idSql: pre.IdTarea,
                            codigoOrden: pre.Codigo,
                            cliente: pre.NOMBRECLI.trim(),
                            modelo: pre.DESCRIPCIONARTICULO.trim(),
                            referencia: pre.CodigoArticulo,
                            tallasArticulo: pre.Tallas.split(','),
                            cantidadFabricar: pre.CantidadFabricar,
                            cantidadFabricada: pre.CantidadFabricada,
                            descripcionOperacion: pre.Descripcion,
                            pedidoLinea: pre.PedidoLinea,
                        }))
                    }


                    tareaActual = new Tarea({
                        idPuestoSql: puesto.Id,
                        detallesTarea: detalles,
                        etiquetaFichada: codigoEtiqueta,
                        utillaje: utillaje,
                        tallaUtillaje: tallaUtillaje,
                    })

                    await tareaActual.save()

                    return res.json(tareaActual)
                }
                else {
                    return res.status(505).json({
                        message: 'Hay una tarea en curso!'
                    })
                }
            }


        } catch (err) {
            console.error(err)
            res.status(500).json({
                'message': err
            })
        }

    })

    // actualizado
    router.post('/tarea/normalizarPaquetes', async (req, res) => {
        try {
            puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                throw new Error('No hay un puesto configurado en la pantalla')
            }
            else {
                let tareaActual = await Tarea.findOne({ "idPuestoSql": puesto.Id, terminado: false })
                if (tareaActual == null) {
                    res.status(500).json({
                        message: 'No hay tarea!'
                    })
                }
                else {
                    let paqueteNormalizar = tareaActual.paquetes.find(p => p.cerrado == false)
                    if (paqueteNormalizar == null) {
                        tareaActual.paquetes.push(new Paquete({
                            cantidad: 0,
                        }))
                    }
                    else {
                        if (paqueteNormalizar.cantidad < puesto.ContadorPaquetes) {
                            /*res.status(403).json({
                                message: 'No puedes cerrar un paquete que no ha llegado al mínimo'
                            })*/
                            paqueteNormalizar.cerrado = true
                            tareaActual.paquetes.push(new Paquete({
                                cantidad: 0,
                            }))
                        }
                        else {
                            paqueteNormalizar.cerrado = true
                            const cantidadNormalizar = paqueteNormalizar.cantidad - puesto.ContadorPaquetes
                            paqueteNormalizar.cantidad -= cantidadNormalizar
                            tareaActual.paquetes.push(new Paquete({
                                cantidad: cantidadNormalizar,
                            }))
                        }

                    }

                    await tareaActual.save()
                    return res.json(tareaActual)
                }
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    // actualizado
    router.post('/tarea/recopilarParesOtrosPuestos', async (req, res) => {
        const { idsTareas, idPuesto } = req.body

        try {
            let cantidad = 0
            let tareaActual = await Tarea.findOne({ "idPuestoSql": idPuesto, terminado: false })
            if (tareaActual == null) {
                return res.status(500).json({
                    message: 'No hay tarea!'
                })
            }
            else {
                for (const id of idsTareas) {
                    const detalle = tareaActual.detallesTarea.find(x => x.idSql == id)
                    if (detalle != null) {
                        const resultados = await Tarea.find({
                            "detallesTarea.idSql": id,
                            "fechaFin": { $gte: tareaActual.fechaInicio },
                        })
                        for (const resultado of resultados) {
                            cantidad += resultado.cantidadFabricadaPuesto.sum('cantidad') + resultado.cantidadDefectuosaPuesto.sum('cantidad') - resultado.cantidadSaldosPuesto.sum('cantidad')
                        }
                    }
                }

                res.json({
                    cantidad: cantidad
                })
            }

        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }

    })

}