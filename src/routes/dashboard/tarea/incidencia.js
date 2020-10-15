const express = require('express')
const configParams = require('../../../lib/config.params')
const Incidencia = require('../../../lib/model/incidencia.model')
const router = express.Router()

module.exports = function (router) {
    router.post('/tarea/incidencia/nueva', async (req, res) => {
        const  incidencia  = req.body

        try {
            const puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                return res.status(404).json({
                    message: 'No hay puesto configurado'
                })
            }

            let fechaFin = Date.now()
            fechaFin = fechaFin+  1000 * incidencia.SegundosEjecucion

            const nuevaIncidencia = new Incidencia({
                idPuestoSql: puesto.Id,
                idSql: incidencia.Id,
                avisarA: incidencia.AvisarA,
                corregible: incidencia.Corregible,
                nombre: incidencia.Nombre,
                pinNotificacion1: incidencia.PinNotificacion1,
                pinNotificacion2: incidencia.PinNotificacion2,
                segundosEjecucion: incidencia.SegundosEjecucion,
                bloqueante: incidencia.Bloqueante
            })

            await nuevaIncidencia.save()
            res.status(200).json(nuevaIncidencia)

        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }
    })

    router.post('/tarea/incidencia/resolver', async (req, res) => {
        const  incidencia  = req.body

        try {
            const puesto = configParams.read()
            if (puesto == null || !puesto.Id) {
                return res.status(404).json({
                    message: 'No hay puesto configurado'
                })
            }

            const incidenciaActual = Incidencia.findOne({idSql:incidencia.Id, mostrar: true})

            if(incidenciaActual == null){
                return res.status(404).json({
                    message: 'No se encontró la incidencia para resolver'
                })
            }
            else{
                incidenciaActual.mostrar = false
                incidenciaActual.fechaFin = Date.now
                await incidenciaActual.save()
                return res.status(200).json(incidenciaActual)
            }

        } catch (err) {
            res.status(500).json({
                message: err
            })
        }
    })
}