
let numMaquinas = 1
$('#btn-add-maquina').click(function () {
    numMaquinas++

    $('#tbody-maquinas').append(`
        <tr id="fila-maquina-${numMaquinas}">
            <td>
                <select id="select-secciones-${numMaquinas}" name="seccion-${numMaquinas}" class="">
                
                </select>
            </td>
            <td>
                <select id="select-maquinas-${numMaquinas}" name="maquina-${numMaquinas}" class="select-maquinas">
                    
                </select>
            </td>
            <td>
                <div id="btn-borrar-maquina-${numMaquinas}" class="waves-effect waves-dark btn btn-sm btn-danger"> Quitar</div>
            </td>
        </tr>
    `)

    $(`#btn-borrar-maquina-${numMaquinas}`).click(borrarMaquina)
    $(`#select-maquinas-${numMaquinas}`).click(refrescarDatasource)

    $.ajax({
        method: 'POST',
        url: `/dashboard/settings/secciones`,
        dataType: 'json',

        success: (secciones) => {
            let innerHTML = ''
            if (secciones) {
                for (const seccion of secciones) {
                    innerHTML += `<option value="${seccion.CodSeccion}">${seccion.Nombre}</option>`
                }
            }

            $(`#select-secciones-${numMaquinas}`).html(innerHTML)
            $(`#select-secciones-${numMaquinas}`).change(buscarMaquinasSeccion)
            $(`#select-secciones-${numMaquinas}`).val(0);

        },
        error: (err) => {
            error("Error al traer secciones")
        }
    })
})

$('#select-maquinas-1').change(refrescarDatasource)
$('#select-secciones-1').change(buscarMaquinasSeccion)
$('#btn-borrar-maquina-1').click(borrarMaquina)
refrescarDatasource()

function refrescarDatasource() {
    const selects = $('.select-maquinas')
    Puesto.Maquinas = []
    for(const select of selects){
        const codigoMaquina = $(select).find(":selected").val()
        $.ajax({
            method: 'POST',
            url: `/dashboard/settings/buscarMaquina`,
            data: { codigoMaquina: codigoMaquina },
            dataType: 'json',
            success: (maquina) => {
                if (maquina) {
                    if(Puesto.Maquinas.filter(x=>x.ID == maquina.ID).length== 0){
                        maquina.NumeroFila = Number(select.id.split('-')[2])
                        Puesto.addMaquina(maquina)
                    }
                    else{
                        error(`Hay una máquina repetida\n${maquina.Nombre}`)
                    }
                }
            },
            error: (err) => {
                error("Error al buscar máquina")
            }
        })
    }
}

function borrarMaquina() {
    const numeroFila = $(this).attr('id').split('-')[3]
    $(`#fila-maquina-${numeroFila}`).remove()
    Puesto.removeMaquina({NumeroFila:numeroFila})
}

function buscarMaquinasSeccion() {
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
                    innerHTML += `<option value="${maquina.CodigoEtiqueta}">${maquina.Nombre}</option>`
                }
                $(`#select-maquinas-${idSelectMaquina}`).prop("selectedIndex", 0);
            }
            selectMaquinas.innerHTML = innerHTML
            refrescarDatasource()
        },
        error: (err) => {
            error(`Error al traer las máquinas de sección ${codSeccion}`)
        }
    })
}