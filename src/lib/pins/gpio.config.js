const Gpio = require('onoff').Gpio
const PINS = {}
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
                    PINS[maquina.PinPulso].gpio_object = new Gpio(PINS[maquina.PinPulso].number, PINS[maquina.PinPulso].mode, 'rising', { debounceTimeout: 10 })
                    PINS[maquina.PinPulso].gpio_object.watch((err, value) => {
                        if (err) {
                            console.error(err)
                        }
                        else {
                            PINS[maquina.PinPulso].pulsesUp.push(1)
                        }
                    })
                } catch (err) {
                    console.error(`Error al abrir el ${maquina.PinPulso}`)
                }

                if (maquina.PinPulso2 != null && maquina.PinPulso2 != 'null') {
                    PINS[maquina.PinPulso].depends_on = Number(maquina.PinPulso2.replace('GPIO', ''))
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
            if (PINS[PIN].gpio_object == null) continue

            PINS[PIN].value = PINS[PIN].gpio_object.readSync()
            if (PINS[PIN].previous_value !== PINS[PIN].value) {
                if (PINS[PIN].value == 1) {
                    if (PINS[PIN].flanco == 'up') {
                        //if (PINS[PIN].depends_on > 0) {
                        //    const value_depends = PINS[`GPIO${PINS[PIN].depends_on}`].gpio_object.readSync()
                        //    if (value_depends == 1) {
                        //        PINS[PIN].pulsesUp.push(1)
                        //    }
                        //}
                        //else {
                        PINS[PIN].pulsesUp.push(1)
                        //}
                    }
                }
                else {
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

function desconectar() {
    for (const pin in PINS) {
        if (PINS[pin].gpio_object != null) {
            PINS[pin].gpio_object.unexport()
        }
    }
}


module.exports = {
    iniciar: iniciar,
    //refrescarValoresLectura: refrescarValoresLectura,
    PINS: PINS,
    configurarPuesto: configurarPuesto,
    desconectar: desconectar,
}


