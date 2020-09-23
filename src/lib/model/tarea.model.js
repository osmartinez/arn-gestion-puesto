const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Etiqueta = require('./etiqueta.model')
const Operario = require('./operario.model')

const tareaSchema = new mongoose.Schema({
    idSql: {type: Number, required:true},
    etiquetas: {type: [Etiqueta]},
    fechaPrimerFichaje: {type:Date},
    utillaje: {type: String},
    tallaUtillaje: {type: String},
    tallasArticulo: {type: [String]},
    cantidadFabricar: {type: Number},
    cantidadSaldos: {type:Number},
    cantidadFabricada: {type: Number},

    // generados por mi app
    cantidadFabricadaConfirmada: {type:Number},
    cantidadDefectuosaConfirmada: {type:Number},
    cantidadSaldosConfirmados: {type:Number},

})

module.exports = mongoose.model('Tarea', tareaSchema)