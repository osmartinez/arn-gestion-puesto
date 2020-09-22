function armarTablaIO() {
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
    //$(`#fila-pin-buzzer`).html('<th class ="black text-white">PIN buzzer</th>')

    for (const maquina of Puesto.Maquinas) {
        $(`#fila-maquina`).append(`<td>${maquina.Nombre}</td>`)

        $(`#fila-pulso-manual`).append(`<td>
                                <div class="switch">
                                <label class="font-weight-bold">
                                    <span></span>
                                    <input id="check-pulso-manual-${maquina.NumeroFila}" name="check-pulso-manual-${maquina.NumeroFila}" type="checkbox" ${maquina.EsPulsoManual ? 'checked' : ''}>
                                    <span class="lever"></span>
                                    <span></span>
                                </label>
                                </div>
                            </td>`)

        $(`#fila-pares-pulso`).append(`<td>
                                            <div class="def-number-input number-input safari_only">
                                            <div onclick="this.parentNode.querySelector('input[type=number]').stepDown();this.parentNode.querySelector('input[type=number]').dispatchEvent(new Event('change'))" class="btn btn-danger btn-sm minus"><i class="fas fa-minus"></i></div>
                                            <input id="pares-pulso-${maquina.NumeroFila}" class="quantity" min="0" name="pares-pulso-${maquina.NumeroFila}" value="${maquina.ProductoPorPulso}" type="number">
                                            <div onclick="this.parentNode.querySelector('input[type=number]').stepUp();this.parentNode.querySelector('input[type=number]').dispatchEvent(new Event('change'))" class="btn btn-success btn-sm plus"><i class="fas fa-plus"></i></div>
                                            </div>
                                        </td>`)

        $(`#fila-pin-pulso`).append(`<td><select id="select-pin-pulso-${maquina.NumeroFila}" name="select-pin-pulso-${maquina.NumeroFila}">
                                       ${getAllPins(maquina.PinPulso)}
                                    </select></td>`)

        $(`#fila-descontar-auto`).append(`<td>
                                        <div class="switch">
                                        <label class="font-weight-bold">
                                            <span></span>
                                            <input id="descontar-auto-${maquina.NumeroFila}" type="checkbox" ${maquina.DescontarAutomaticamente ? 'checked' : ''}>
                                            <span class="lever"></span>
                                            <span></span>
                                        </label>
                                        </div>
                                    </td>`)

        $(`#check-pulso-manual-${maquina.NumeroFila}`).click(() => {
            maquina.EsPulsoManual = $(`#check-pulso-manual-${maquina.NumeroFila}`).is(":checked")
        })

        $(`#descontar-auto-${maquina.NumeroFila}`).click(() => {
            maquina.DescontarAutomaticamente = $(`#descontar-auto-${maquina.NumeroFila}`).is(":checked")
        })

        $(`#pares-pulso-${maquina.NumeroFila}`).change(function () {
            maquina.ProductoPorPulso = Number($(`#pares-pulso-${maquina.NumeroFila}`).val())
        })

        $(`#select-pin-pulso-${maquina.NumeroFila}`).change(() => {
            maquina.PinPulso = $(`#select-pin-pulso-${maquina.NumeroFila}`).find(":selected").val()
        })

        /*$(`#select-pin-buzzer-${maquina.NumeroFila}`).change(()=>{
            maquina.PinBuzzer = $(`#select-pin-buzzer-${maquina.NumeroFila}`).find(":selected").val()
        })*/

    }




    // fila pulsos
}