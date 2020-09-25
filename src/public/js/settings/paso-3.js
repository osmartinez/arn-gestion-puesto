

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
    <tr id="fila-contador-paquetes">
        <th class="black text-white">Contador paquetes</th>
        <td>
            <input id="contador-paquetes" type="number" value="${Puesto.PuestosConfiguracionesPins.ContadorPaquetes}"/>
        </td>
    </tr>
    <tr id="fila-es-contador-paquetes-auto">
        <th class="black text-white">Contador paquetes auto?</th>
        <td>
            <div class="switch">
            <label class="font-weight-bold">
                <span></span>
                <input id="check-contador-paquetes-auto" type="checkbox" ${Puesto.PuestosConfiguracionesPins.EsContadorPaquetesAutomatico? 'checked' : ''}>
                <span class="lever"></span>
                <span></span>
            </label>
            </div>
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

    $('#contador-paquetes').change(function(){
        Puesto.PuestosConfiguracionesPins.ContadorPaquetes = $('#contador-paquetes').val()
    })

    $(`#check-contador-paquetes-auto`).click(() => {
        Puesto.PuestosConfiguracionesPins.EsContadorPaquetesAutomatico = $(`#check-contador-paquetes-auto`).is(":checked")
    })

}