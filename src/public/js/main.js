function error(msg){
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    })
    
    Toast.fire({
        type: 'error',
        title: msg
    })
}

function info(msg){
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    })
    
    Toast.fire({
        type: 'success',
        title: msg
    })
}
