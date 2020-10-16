const device = process.env.DEVICE_ENV ||'raspi'
var GpioConfiguracion = null
if(device == 'raspi'){
    GpioConfiguracion = require('../../lib/pins/gpio.config')
}
module.exports = function (router) {
    router.post('/gpio/obtenerEstadoPins', async (req, res) => {
        if(device == 'raspi'){
            //GpioConfiguracion.refrescarValoresLectura()
            res.json(GpioConfiguracion.PINS)
        }
        else{
            res.json({})
        }

    })
}