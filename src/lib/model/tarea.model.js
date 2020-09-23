const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Etiqueta = require('./etiqueta.model').schema
const Operario = require('./operario.model').schema

const tareaSchema = new mongoose.Schema({
    idSql: {type: Number, required:true},
    etiquetas: {type: [Etiqueta]},
    fechaPrimerFichaje: {type:Date,default: new Date()},
    utillaje: {type: String},
    tallaUtillaje: {type: String},
    tallasArticulo: {type: [String]},
    cantidadFabricar: {type: Number},
    cantidadSaldos: {type:Number},
    cantidadFabricada: {type: Number},

    // generados por mi app
    cantidadFabricadaConfirmada: {type:Number,default:0},
    cantidadDefectuosaConfirmada: {type:Number,default:0},
    cantidadSaldosConfirmados: {type:Number,default:0},

})

module.exports = mongoose.model('Tarea', tareaSchema)