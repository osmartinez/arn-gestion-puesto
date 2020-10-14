const device = process.env.DEVICE_ENV ||'raspi'

module.exports = function (router) {
    router.post('/gpio/obtenerEstadoPins', async (req, res) => {
        if(device == 'raspi'){
            const GpioConfiguracion = require('../../lib/pins/gpio.config')
            GpioConfiguracion.refrescarValoresLectura()
            res.json(GpioConfiguracion.PINS)
        }
        else{
            res.json({})
        }

    })
}