const mongoose = require('mongoose')

const detalleTareaSchema = new mongoose.Schema({
    idSql: {type: Number, required:true}, // idOFOTC
    tallasArticulo: {type: [String]},
    cantidadFabricar: {type: Number},
    cantidadSaldos: {type:Number},
    cantidadFabricada: {type: Number},
    cliente:{type:String},
    modelo: {type:String},
    referencia:{type: String},
    codigoOrden: {type:String},
    pedidoLinae: {type: String},
    descripcionOperacion:{ type:String}
})

module.exports = mongoose.model('DetalleTarea', detalleTareaSchema)