const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Prepaquete = require('./prepaquete.model').schema

const etiquetaSchema = new mongoose.Schema({
    codigoEtiqueta: {type: String, required:true},
    esAgrupacion: {type:Boolean},
    prepaquetes: {type: [Prepaquete]},
    codSeccion: {type: String},
    fechaLectura: {type:Date, default: new Date()}
})

module.exports = mongoose.model('Etiqueta', etiquetaSchema)