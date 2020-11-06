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
    $(`#fila-pin-pulso-dependiente`).html('<th class ="black text-white">PIN dependiente</th>')
    $(`#fila-valor-pulso-dependiente`).html('<th class ="black text-white">Valor dependiente</th>')
    $(`#fila-disparo-pulso`).html('<th class ="black text-white">Disparo pulso</th>')
    $(`#fila-bouncing-pulso`).html('<th class ="black text-white">Bouncing pulso</th>')

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

        $(`#fila-pin-pulso-dependiente`).append(`<td><select id="select-pin-pulso-dependiente-${maquina.NumeroFila}">
                                    ${getAllPins(maquina.PinPulso2)}
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

        $(`#fila-valor-pulso-dependiente`).append(`<td>
                                                    <div class="def-number-input number-input safari_only">
                                                    <div onclick="this.parentNode.querySelector('input[type=number]').stepDown();this.parentNode.querySelector('input[type=number]').dispatchEvent(new Event('change'))" class="btn btn-danger btn-sm minus"><i class="fas fa-minus"></i></div>
                                                    <input id="valor-pulso-dependiente-${maquina.NumeroFila}" class="quantity" min="0" max="1" value="${maquina.ValorPulsoDependiente}" type="number">
                                                    <div onclick="this.parentNode.querySelector('input[type=number]').stepUp();this.parentNode.querySelector('input[type=number]').dispatchEvent(new Event('change'))" class="btn btn-success btn-sm plus"><i class="fas fa-plus"></i></div>
                                                    </div>
                                                </td>`)

        $(`#fila-disparo-pulso`).append(`<td>
                                            <select id="select-disparo-pulso-${maquina.NumeroFila}">
                                            ${getAllPulseFlanks(maquina.DisparoPulso)}
                                            </select>
                                        </td>`)

        $(`#fila-bouncing-pulso`).append(`<td>
                                                <div class="def-number-input number-input safari_only">
                                                <div onclick="this.parentNode.querySelector('input[type=number]').stepDown();this.parentNode.querySelector('input[type=number]').dispatchEvent(new Event('change'))" class="btn btn-danger btn-sm minus"><i class="fas fa-minus"></i></div>
                                                <input id="valor-bouncing-pulso-${maquina.NumeroFila}" class="quantity" min="0" value="${maquina.ValorBouncingPulso}" type="number">
                                                <div onclick="this.parentNode.querySelector('input[type=number]').stepUp();this.parentNode.querySelector('input[type=number]').dispatchEvent(new Event('change'))" class="btn btn-success btn-sm plus"><i class="fas fa-plus"></i></div>
                                                </div>
                                            </td>`)

        // eventos

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

        $(`#select-pin-pulso-dependiente-${maquina.NumeroFila}`).change(() => {
            maquina.PinPulso2 = $(`#select-pin-pulso-dependiente-${maquina.NumeroFila}`).find(":selected").val()
        })

        $(`#valor-pulso-dependiente-${maquina.NumeroFila}`).change(function () {
            maquina.ValorPulsoDependiente = Number($(`#valor-pulso-dependiente-${maquina.NumeroFila}`).val())
        })

        $(`#valor-bouncing-pulso-${maquina.NumeroFila}`).change(function () {
            maquina.ValorBouncingPulso = Number($(`#valor-bouncing-pulso-${maquina.NumeroFila}`).val())
        })

        $(`#select-disparo-pulso-${maquina.NumeroFila}`).change(() => {
            maquina.DisparoPulso = $(`#select-disparo-pulso-${maquina.NumeroFila}`).find(":selected").val()
        })
    

    }




    // fila pulsos
}