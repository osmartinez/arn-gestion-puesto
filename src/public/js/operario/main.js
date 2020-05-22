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
    let lista = document.getElementById('lista');

    lista.innerHTML +=
        `<div class="card mb-1">
        <div class="card-body">
        <div class="row">
          <div class="col-sm-2">
            <p>${codigo}</p>
          </div>
          <div class="col-sm-4">
            <p>OSCAR</p>
          </div>
          <div class="col-sm-4">
          <p>MARTINEZ</p>
        </div>
          <div class="col-sm-2">
            <a href="#"  class="btn btn-danger">X</a>
          </div>
        </div>  
       </div>
      </div>`;

      input.value = ''
}