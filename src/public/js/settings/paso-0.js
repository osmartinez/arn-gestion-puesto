function armarFormulario(){
    $('#puesto-descripcion').val(Puesto.Descripcion)
    $('#puesto-observaciones').val(Puesto.Observaciones)
    $('#es-puesto-manual').attr('checked',Puesto.EsManual)

}

$('#puesto-descripcion').change(function(){
    Puesto.Descripcion= $('#puesto-descripcion').val()
})

$('#puesto-observaciones').change(function(){
    Puesto.Observaciones= $('#puesto-observaciones').val()
})

$('#es-puesto-manual').change(function(){
    Puesto.EsManual= $('#es-puesto-manual').is(":checked")
})


$('#puesto-previo').change(function(){
    const valor =   $('#puesto-previo').find(":selected").val()
    if(valor != 'NUEVO'){
        const idPuesto = Number(valor)
        Puesto.loadPuesto(idPuesto)
    }
    else{
       Puesto.nuevo()
    }
})