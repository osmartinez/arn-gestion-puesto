function armarTabla() {
    let filaMaquinas = ''
    let filaPulsoManual = ''
    let filaParesPulso = ''
    let filaPinPulso = ''
    let filaPinBuzzer = ''

    // fila maquinas
    $(`#fila-maquina`).html('<th class ="black text-white">Máquina</th>')
    $(`#fila-pulso-manual`).html('<th class ="black text-white">Pulso Manual</th>')
    $(`#fila-pares-pulso`).html('<th class ="black text-white">Pares Pulso</th>')
    $(`#fila-pin-pulso`).html('<th class ="black text-white">PIN pulso</th>')
    $(`#fila-pin-buzzer`).html('<th class ="black text-white">PIN buzzer</th>')

    for (const maquina of puesto.maquinas) {
        $(`#fila-maquina`).append(`<td>${maquina.Nombre}</td>`)
        $(`#fila-pulso-manual`).append(`<td>
                                <div class="switch">
                                <label class="font-weight-bold">
                                    <span></span>
                                    <input id="check-pulso-manual-${maquina.NumeroFila}" type="checkbox" ${maquina.PulsoManual? 'checked':''}>
                                    <span class="lever"></span>
                                    <span></span>
                                </label>
                                </div>
                            </td>`)
        //$(`#fila-pares-pulso`).append(`<td><input id="pares-pulso-${maquina.NumeroFila}" type="number" value="1"/></td>`)
        $(`#fila-pares-pulso`).append(`<td>
                                            <div class="def-number-input number-input safari_only">
                                            <div onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="btn btn-danger btn-sm minus"><i class="fas fa-minus"></i></div>
                                            <input id="pares-pulso-${maquina.NumeroFila}" class="quantity" min="0" name="quantity" value="1" type="number">
                                            <div onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="btn btn-success btn-sm plus"><i class="fas fa-plus"></i></div>
                                            </div>
                                        </td>`)

        $(`#fila-pin-pulso`).append(`<td><select id="select-pin-pulso-${maquina.NumeroFila}">
                                        <option value="GPIO4">GPIO4</option>
                                        <option value="GPIO5">GPIO5</option>
                                        <option value="GPIO6">GPIO6</option>
                                        <option value="GPIO8">GPIO8</option>
                                    </select></td>`)
        $(`#fila-pin-buzzer`).append(`<td><select id="select-pin-buzzer-${maquina.NumeroFila}">
                                        <option value="GPIO4">GPIO4</option>
                                        <option value="GPIO5">GPIO5</option>
                                        <option value="GPIO6">GPIO6</option>
                                        <option value="GPIO8">GPIO8</option>
                                    </select></td>`)

        $(`#check-pulso-manual-${maquina.NumeroFila}`).click(()=>{
            maquina.PulsoManual = $(`#check-pulso-manual-${maquina.NumeroFila}`).is(":checked")
        })

        $(`#pares-pulso-${maquina.NumeroFila}`).bind('keyup mouseup', function () {
            maquina.ParesPulso = Number($(`#pares-pulso-${maquina.NumeroFila}`).val())
        });

        $(`#select-pin-pulso-${maquina.NumeroFila}`).change(()=>{
            maquina.PinPulso = $(`#select-pin-pulso-${maquina.NumeroFila}`).find(":selected").val()
        })

        $(`#select-pin-buzzer-${maquina.NumeroFila}`).change(()=>{
            maquina.PinBuzzer = $(`#select-pin-buzzer-${maquina.NumeroFila}`).find(":selected").val()
        })

    }




    // fila pulsos
}