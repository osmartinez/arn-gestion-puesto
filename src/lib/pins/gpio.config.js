const Gpio = require('onoff').Gpio

function ConfiguracionGPIO() {
    const PINS = {
    }

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
                        PINS[maquina.PinPulso].gpio_object = new Gpio(PINS[maquina.PinPulso].number, 'in')
                    } catch (err) {
                        console.error(`Error al abrir el ${maquina.PinPulso}`)
                    }
                }
            }
        }
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
                PINS[PIN].value = PINS[PIN].gpio_object.readSync()
                if (PINS[PIN].previous_value !== PINS[PIN].value) {
                    if (PINS[PIN].value == 1) {
                        if (PINS[PIN].flanco == 'up') {
                            PINS[PIN].pulsesUp.push(1)
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

