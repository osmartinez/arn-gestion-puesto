const input = document.getElementById('input-operario')
const teclas = document.querySelectorAll('.letter')

let operarios = []

for (const tecla of teclas) {
    tecla.addEventListener('click', () => {
        if (tecla.className.includes('delete')) {
            input.value = input.value.slice(0, -1)
        }
        else {
            input.value += tecla.innerHTML
        }
    })
}

document.getElementById('btn-entrar').addEventListener('click', addOperario);
function pintarTabla(){
    let lista = document.getElementById('tbody');
    lista.innerHTML= ''
    for(const operario of operarios){
        lista.innerHTML +=
        `<tr>
            <th scope="row">${operario.Id}</th>
            <td>${operario.Nombre}</td>
            <td>${operario.Apellidos}</td>
            <td>
                    <li class="list-inline-item">
                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip"
                            data-placement="top" title onclick="salir('${operario.Id}')" ><i class="fa fa-sign-out-alt"></i></button>
                    </li>
            </td>
        </tr>`;
    }
}

function addOperario(e) {
    let codigo = document.getElementById('input-operario').value;
    $.ajax({
        url: '/dashboard/operarios/buscarPorCodigo',
        method: 'POST',
        dataType: 'json',
        data: {codigo: codigo},
        success: (data)=>{
            if(data.Id){
                operarios.push(data)
                pintarTabla()
            }
        },
        error: (err)=>{
            console.log(err)
        }
    })
    
    input.value = ''
}

function salir(codigo){
    operarios = operarios.filter(x=>x.Id != codigo)
    pintarTabla()
}