const input = document.getElementById('input-operario')
const teclas = document.querySelectorAll('.tecla')


for (const tecla of teclas) {
    tecla.addEventListener('click', () => {
        if (tecla.className.includes('clear')) {
            input.innerHTML = input.innerHTML.slice(0, -1)
        }
        else {
            input.innerHTML += tecla.innerHTML.trim()[0]
        }
    })
}

document.getElementById('btn-entrar').addEventListener('click', addOperario);
function pintarTabla(){
    let lista = document.getElementById('tbody');
    lista.innerHTML= ''
    for(const operario of Puesto.Operarios){
        lista.innerHTML +=
        `<tr>
            <th scope="row">${operario.codigoOperarioSql}</th>
            <td>${operario.nombre}</td>
            
            <td>
                    <li class="list-inline-item">
                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip"
                            data-placement="top" title onclick="salir('${operario.codigoOperarioSql}')" ><i class="fa fa-sign-out-alt"></i></button>
                    </li>
            </td>
        </tr>`;
    }
}

function addOperario(e) {
    let codigo = document.getElementById('input-operario').innerHTML;
    document.getElementById('input-operario').innerHTML = '';

    $.ajax({
        url: '/dashboard/fichajes/entrada',
        method: 'POST',
        dataType: 'json',
        data: {codigo: codigo},
        success: (operarios)=>{
            Puesto.Operarios = operarios
            pintarTabla()
        },
        error: (err)=>{
            error(err.responseJSON.message)
        }
    })
    
    input.value = ''
}

function salir(codigo){
    $.ajax({
        url: '/dashboard/fichajes/salida',
        method: 'POST',
        dataType: 'json',
        data: {codigo: codigo},
        success: (operarios)=>{
            Puesto.Operarios = operarios
            pintarTabla()
        },
        error: (err)=>{
            console.log(err)
        }
    })



}