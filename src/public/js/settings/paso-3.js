$('#pin-buzzer').change(function(){
    const seleccion = $('#pin-buzzer').find(":selected").val()
    Puesto.PuestosConfiguracionesPins.PinBuzzer = seleccion
})

$('#pin-led').change(function(){
    const seleccion = $('#pin-led').find(":selected").val()
    Puesto.PuestosConfiguracionesPins.PinLed = seleccion
})