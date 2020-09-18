

function armarTablaPinsPuesto(){
    $('#tbody-pins-puesto').html(`
    <tr id="fila-maquina">
        <th class="black text-white">Pin Buzzer</th>
        <td>
            <select id="pin-buzzer" name="pin-buzzer">
                ${getAllPins(Puesto.PuestosConfiguracionesPins.PinBuzzer)}
            </select>
        </td>
    </tr>
    <tr id="fila-pulso-manual">
        <th class="black text-white">Pin Led</th>
        <td>
            <select id="pin-led" name="pin-led">
                ${getAllPins(Puesto.PuestosConfiguracionesPins.PinLed)}
            </select>
        </td>
    </tr>
    `)

    $('#pin-buzzer').change(function(){
        const seleccion = $('#pin-buzzer').find(":selected").val()
        Puesto.PuestosConfiguracionesPins.PinBuzzer = seleccion
    })
    
    $('#pin-led').change(function(){
        const seleccion = $('#pin-led').find(":selected").val()
        Puesto.PuestosConfiguracionesPins.PinLed = seleccion
    })

}