const Gpio = require('onoff').Gpio

function ConfiguracionGPIO() {
    const PINS = { }

    const pinCount = 26

    function iniciar() {
        for (let i = 1; i <= 26; i++) {
            PINS[`GPIO${i}`] = {
                number: i,
                mode: 'in',
                status: 'off',
                value: 0,
                gpio_object: null,
                flanco: '',
                previous_value: 0,
                pulsesUp: [],
                pulsesDown: [],
                depends_on: -1,
                type: null,
            }
        }
    }

    function configurarPuesto(puesto) {
        // entradas
        for (const maquina of puesto.Maquinas) {
            if (!maquina.EsPulsoManual) {
                if (maquina.PinPulso != null && maquina.PinPulso != 'null') {
                    PINS[maquina.PinPulso].mode = 'in'
                    PINS[maquina.PinPulso].status = 'on'
                    PINS[maquina.PinPulso].flanco = 'up'
                    PINS[maquina.PinPulso].type = 'main-pulse'

                    try {
                        PINS[maquina.PinPulso].gpio_object = new Gpio(PINS[maquina.PinPulso].number, PINS[maquina.PinPulso].mode)
                    } catch (err) {
                        console.error(`Error al abrir el ${maquina.PinPulso}`)
                    }

                    if(maquina.PinPulso2 != null && maquina.PinPulso2 != 'null') {
                        PINS[maquina.PinPulso].depends_on =Number(maquina.PinPulso2.replace('GPIO',''))
                    }
                }
            }
        }

        /*for(const configIncidencia of puesto.PuestosConfiguracionesIncidencias){
            if(configIncidencia.Habilitada){
                if(configIncidencia.PinNotificacion1 != null && configIncidencia.PinNotificacion1 != 'null'){
                    PINS[configIncidencia.PinNotificacion1].mode = 'out'
                    PINS[configIncidencia.PinNotificacion1].status = 'on'
                    PINS[configIncidencia.PinNotificacion1].type = 'incidence'
                }

                if(configIncidencia.PinNotificacion2 != null && configIncidencia.PinNotificacion2 != 'null'){
                    PINS[configIncidencia.PinNotificacion2].mode = 'out'
                    PINS[configIncidencia.PinNotificacion2].status = 'on'
                    PINS[configIncidencia.PinNotificacion2].type = 'incidence'
                }

                try {
                    PINS[configIncidencia.PinNotificacion1].gpio_object = new Gpio(PINS[configIncidencia.PinNotificacion1].number, PINS[configIncidencia.PinNotificacion1].mode)
                    PINS[configIncidencia.PinNotificacion2].gpio_object = new Gpio(PINS[configIncidencia.PinNotificacion2].number, PINS[configIncidencia.PinNotificacion2].mode)

                } catch (err) {
                    console.error(`Error al abrir el ${configIncidencia.PinNotificacion1}`)
                    console.error(`Error al abrir el ${configIncidencia.PinNotificacion2}`)
                }

            }
        }*/

        // salidas puesto pinled&pinbuzzer

    }

    function configurarPin(pin, modo) {
        PINS[pin].mode = modo
        PINS[pin].status = 'on'
        PINS[pin].gpio_object = new Gpio(PINS[pin].number, modo)
    }

    function refrescarValoresLectura() {
        for (const PIN in PINS) {
            if (PINS[PIN].status == 'on' && PINS[PIN].mode == 'in') {
                PINS[PIN].previous_value = PINS[PIN].value
                if(PINS[PIN].gpio_object == null)continue

                PINS[PIN].value = PINS[PIN].gpio_object.readSync()
                if (PINS[PIN].previous_value !== PINS[PIN].value) {
                    if (PINS[PIN].value == 1) {
                        if (PINS[PIN].flanco == 'up') {
                            if(PINS[PIN].depends_on>0){
                                const value_depends = PINS[`GPIO${PINS[PIN].depends_on}`].gpio_object.readSync()
                                if(value_depends == 1){
                                    PINS[PIN].pulsesUp.push(1)
                                }
                            }
                            else{
                                PINS[PIN].pulsesUp.push(1)
                            }
                        }
                    }
                    else{
                        if (PINS[PIN].flanco == 'down') {
                            PINS[PIN].pulsesDown.push(1)
                        }
                    }
                   
                }

            }
        }
    }

    function escribirValor(pin, valor) {
        if (PINS[pin].status == 'on') {
            PINS[PIN].gpio_object.writeSync(valor)
        }
        else {
            throw new Error(`${pin} está apagado`)
        }
    }

    return {
        PINS,
        pinCount,
        iniciar,
        configurarPin,
        refrescarValoresLectura,
        escribirValor,
        configurarPuesto,
    }
}

module.exports = ConfiguracionGPIO()

