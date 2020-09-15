$('#puesto-descripcion').change(function(){
    Puesto.Descripcion= $('#puesto-descripcion').val()
})

$('#puesto-observaciones').change(function(){
    Puesto.Observaciones= $('#puesto-observaciones').val()
})

$('#puesto-previo').change(function(){
    const nombre =   $('#puesto-previo').find(":selected").val()
    Puesto.CrearNuevo = (nombre == 'NUEVO')
})