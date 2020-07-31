$(document).ready(function () {
    $('.stepper').mdbStepper();
    //$('.mdb-select').materialSelect();
    const $valueSpan = $('#label-ritmo-ideal');
    const $value = $('#input-ritmo-ideal');
    $valueSpan.html($value.val());
    $value.on('input change', () => {
        $valueSpan.html($value.val());
    });
    Keyboard.init();
})

var numMaquinas = 1

$('#btn-add-maquina').click(function () {
    numMaquinas++

    $('#body-step-1').append(`
    <div class="row">

    <div class=" col-6 ml-auto">
      <label class="">Sección ${numMaquinas}</label>

      <!--Secciones select-->
      <select id="select-secciones-${numMaquinas}" name="seccion-${numMaquinas}" class="">
        <option value="maquina" >maquina
        </option>
      </select>
      <!--/Secciones select-->
    </div>

    <div class="col-6 ml-auto">
      <label class="">Máquina ${numMaquinas}</label>

      <!--Maquinas select-->
      <select id="select-maquinas-${numMaquinas}" name="maquina-${numMaquinas}" class="">

      </select>
      <!--/Blue select-->
    </div>
  </div>`)
    //$('.mdb-select').materialSelect();

    $('#body-pins').append(`
    <div class="row">
    <div class="col-6 ml-auto">
      <label class="">Pin pulso ${numMaquinas}</label>
      <!--PINS select-->
      <select id="select-pin-pulso-${numMaquinas}" name="pin-pulso-${numMaquinas}" class="">
        <option>MANUAL</option>
        <option>GPIO 8</option>
        <option>GPIO 12</option>
        <option>GPIO 14</option>
        <option>GPIO 16</option>
        <option>GPIO 18</option>
      </select>
    </div>
    <div class="col-6 ml-auto">
      <label class="">Equivalencia pares</label>
      <!--PINS select-->
      <input min="1" max="999999" type="number" value="1" name="equivalencia-pares-${numMaquinas}">
    </div>
  </div>`)

    $.ajax({
        method: 'POST',
        url: `/dashboard/settings/secciones`,
        dataType: 'json',
        
        success: (secciones) => {
            let innerHTML = ''
            if (secciones) {
                console.log('lol')
                for (const seccion of secciones) {
                    innerHTML += `<option value="${seccion.CodSeccion}">${seccion.Nombre}</option>`
                }
            }

            $(`#select-secciones-${numMaquinas}`).html(innerHTML)
            $(`#select-secciones-${numMaquinas}`).change(buscarMaquinasSeccion)
            $(`#select-secciones-${numMaquinas}`).val(0);

        },
        error: (err) => {
            console.log(error)
        }
    })
})



$('#select-secciones-1').change(buscarMaquinasSeccion)


function buscarMaquinasSeccion () {
    let idSelectMaquina = $(this).attr("id").split('-')[2]
    const codSeccion = $(this).find(":selected").val()
    const selectMaquinas = document.getElementById(`select-maquinas-${idSelectMaquina}`)
    selectMaquinas.innerHTML = ''
    $.ajax({
        method: 'POST',
        url: `/dashboard/settings/maquinasEnSeccion`,
        data: { codSeccion: codSeccion },
        dataType: 'json',
        success: (maquinas) => {
            let innerHTML = ''
            if (maquinas) {
                for (const maquina of maquinas) {
                    innerHTML += `<option value="${maquina.ID}">${maquina.Nombre}</option>`
                }
            }
            selectMaquinas.innerHTML = innerHTML
        },
        error: (err) => {
            console.log(error)
        }
    })
}