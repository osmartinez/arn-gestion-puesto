const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Etiqueta = require('./etiqueta.model').schema
const MovimientoPulso = require('./movimientoPulso.model').schema
const Paquete = require('./paquete.model').schema

const tareaSchema = new mongoose.Schema({
    idSql: {type: Number, required:true},
    etiquetas: {type: [Etiqueta]},
    fechaPrimerFichaje: {type:Date,default: Date.now},
    fechaFin:{type:Date, default: null},
    utillaje: {type: String},
    tallaUtillaje: {type: String},
    tallasArticulo: {type: [String]},
    cantidadFabricar: {type: Number},
    cantidadSaldos: {type:Number},
    cantidadFabricada: {type: Number},
    cliente:{type:String},
    modelo: {type:String},
    referencia:{type: String},
    codigoOrden: {type:String},
    terminado: {type:Boolean, default:false},
    
    // generados por mi app
    cantidadFabricadaPuesto: {type: [MovimientoPulso]},
    cantidadDefectuosaPuesto: {type: [MovimientoPulso]},
    cantidadSaldosPuesto: {type: [MovimientoPulso]},
    paquetes: {type: [Paquete]}


})

module.exports = mongoose.model('Tarea', tareaSchema)