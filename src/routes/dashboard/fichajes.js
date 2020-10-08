const configParams = require('../../lib/config.params')
const puestoWebService = require('../../lib/repository/puesto.ws')()
const MovimientoOperario = require('../../lib/model/movimientoOperario.model')
const operarioWebService = require('../../lib/repository/operario.ws')()

module.exports = function (router) {
    router.get('/operarios', async (req, res) => {
        res.render('dashboard/fichajes/index', { layout: 'main-dashboard' })
    })

    router.post('/fichajes/entrada', async (req, res) => {
        let { codigo } = req.body
        var idPuesto = configParams.read().Id
        try {
            if (!isNaN(codigo)) {
                codigo = 'B00' + codigo
            }

            let movimientoActual = await MovimientoOperario.findOne({ idPuestoSql: idPuesto, codigoOperarioSql: codigo, fechaSalida: null })
            if (movimientoActual != null) {
                throw new Error('Ya estás registrado en este puesto')
            }
            else {
                const operario = await operarioWebService.buscarPorCodigo(codigo)
                if (operario == null) {
                    throw new Error('No existe el operario')
                }
                else {
                    movimientoActual = new MovimientoOperario({
                        idPuestoSql: idPuesto,
                        codigoOperarioSql: codigo,
                        nombre: operario.Nombre,
                        apellidos: operario.Apellidos,
                        idOperarioSql: operario.Id,
                    })
                    await movimientoActual.save()

                    const movimientos = await MovimientoOperario.find({ idPuestoSql: idPuesto, fechaSalida: null })
                    res.json(movimientos)
                }
            }

        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }


    })

    router.post('/fichajes/salida', async (req, res) => {
        let { codigo } = req.body
        var idPuesto = configParams.read().Id

        try {
            if (!isNaN(codigo)) {
                codigo = 'B00' + codigo
            }

            let movimientoActual = await MovimientoOperario.findOne({ idPuestoSql: idPuesto, codigoOperarioSql: codigo, fechaSalida: null })

           
            const operario = await operarioWebService.buscarPorCodigo(codigo)
            if (operario == null) {
                throw new Error('No existe el operario')
            }
            else {
                if(movimientoActual!= null){
                    movimientoActual.fechaSalida = Date.now()
                    await movimientoActual.save()
                }
                
                const movimientos = await MovimientoOperario.find({ idPuestoSql: idPuesto, fechaSalida: null })
                res.json(movimientos)
            }

        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: err
            })
        }

    })
}