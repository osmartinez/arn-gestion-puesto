const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paqueteSchema = new mongoose.Schema({
    fechaCreado: {type: Date, default: Date.now},
    cantidad: {type: Number,default: 0},
    cerrado: {type:Boolean,default:false},
    fechaCerrado: {type:Date, default: null}
})

module.exports = mongoose.model('Paquete', paqueteSchema)