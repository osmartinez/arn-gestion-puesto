
const Tarea = require('../../../lib/model/tarea.model')
const MovimientoOperario = require('../../../lib/model/movimientoOperario.model')
const DetalleTarea = require('../../../lib/model/detalleTarea.model')
const prepaqueteWebService = require('../../../lib/repository/prepaquete.ws')
const ordenFabricacionWebService = require('../../../lib/repository/ordenFabricacion.ws')
const configParams = require('../../../lib/config.params')

function FichajeEtiquetas() {

    async function ficharPrepaquete(req, res) {
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
    }

    async function ficharOF(req,res) {
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
                    if (puesto.Maquinas == null || puesto.Maquinas.length == 0) {
                        return res.status(500).json({
                            message: 'No hay máquinas en el puesto'
                        })
                    }

                    const operaciones = await ordenFabricacionWebService.buscarOperacionesEnSeccion(Number(codigoEtiqueta.slice(0, -1)), puesto.Maquinas[0].CodSeccion)
                    if(operaciones == null || operaciones.length == 0){
                        return res.status(404).json({
                            message: 'No hay operaciones en esta seccion para esta OF'
                        })
                    }

                    return res.json(operaciones)
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
    }

    return {
        ficharPrepaquete,
        ficharOF
    }
}

module.exports = FichajeEtiquetas()