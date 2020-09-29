const configParams = require('../../lib/config.params')
const GpioConfiguracion = require('../../lib/pins/gpio.config')
module.exports = function (router) {
    router.post('/gpio/obtenerEstadoPins', async (req, res) => {
        GpioConfiguracion.refrescarValoresLectura()
        res.json(GpioConfiguracion.PINS)
    })
}