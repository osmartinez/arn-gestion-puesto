const input = document.getElementById('input-operario')
const teclas = document.querySelectorAll('.letter')
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

function addOperario(e) {
    let codigo = document.getElementById('input-operario').value;
    let lista = document.getElementById('tbody');

    lista.innerHTML +=
        `<tr>
            <th scope="row">${codigo}</th>
            <td>OSCAR</td>
            <td>MARTINEZ MARTINEZ</td>
            <td>
                    <li class="list-inline-item">
                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip"
                            data-placement="top" title="Delete"><i class="fa fa-sign-out-alt"></i></button>
                    </li>
            </td>
        </tr>`;

    input.value = ''
}