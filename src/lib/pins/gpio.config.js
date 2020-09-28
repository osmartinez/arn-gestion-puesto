const Gpio = require('onoff').Gpio

function ConfiguracionGPIO(){
    const PINS = {
    }

    const pinCount = 26

    function iniciar(){
        for(let i=1;i<=26;i++){
            PINS[`GPIO${i}`]= {
                number: i,
                mode: 'in',
                status: 'off',
                value: 0,
                gpio_object: null,
            }
        }
    }

    function configurarPin(pin, modo){
        PINS[pin].mode = modo
        PINS[pin].status = 'on'
        PINS[pin].gpio_object = new Gpio(PINS[pin].number, modo)
    }

    function refrescarValores(){
        for(const PIN in PINS){
            if(PINS[PIN].status == 'on'){
                PINS[PIN].value = PINS[PIN].gpio_object.readSync()
            }
        }
    }

    function escribirValor(pin, valor){
        if(PINS[pin].status == 'on'){
            PINS[PIN].gpio_object.writeSync(valor)
        }
        else{
            throw new Error(`${pin} está apagado`)
        }
    }

    return {
        PINS,
        pinCount,
        iniciar,
        configurarPin,
        refrescarValores,
        escribirValor,
    }
}

module.exports = ConfiguracionGPIO()

