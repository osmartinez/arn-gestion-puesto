const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Prepaquete = require('./prepaquete.model')

const etiquetaSchema = new mongoose.Schema({
    codigoEtiqueta: {type: String, required:true},
    esAgrupacion: {type:Boolean},
    prepaquetes: {type: [Prepaquete]},
    fechaLectura: {type:Date}
})

module.exports = mongoose.model('Etiqueta', etiquetaSchema)