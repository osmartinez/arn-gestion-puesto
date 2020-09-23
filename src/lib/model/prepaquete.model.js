const mongoose = require('mongoose')
const Schema = mongoose.Schema

const prepaqueteSchema = new mongoose.Schema({
    codigoEtiqueta: {type: String, required:true},
    cantidad: {type: Number},
    talla: {type: String},
    idOrden: {type:Number},
})

module.exports = mongoose.model('Prepaquete', prepaqueteSchema)