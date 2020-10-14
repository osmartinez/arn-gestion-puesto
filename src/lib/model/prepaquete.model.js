const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prepaqueteSchema = new mongoose.Schema({
    codigoEtiqueta: {type: String, required:true},
    cantidad: {type: Number},
    talla: {type: String},
    codigoOrden: {type:String},
    codSeccion: {type:String},
    cliente: {type:String},
    modelo: {type: String},
    referencia: {type:String},
    utillaje: {type:String},
    tallaUtillaje: {type:String},
    tallasArticulo:{type: [String]},
    cantidadFabricar:{type:Number},
    cantidadFabricada:{type:Number},
    pedidoLinea:{type:String},
    descripcionOperacion:{type:String},
    idTarea: {type:Number},
})

module.exports = mongoose.model('Prepaquete', prepaqueteSchema)