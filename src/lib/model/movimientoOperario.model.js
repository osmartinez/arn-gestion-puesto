const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Operario = require('./operario.model')

const movimientoOperarioSchema = new mongoose.Schema({
    fechaMovimiento: {type:Date},
    operariosActuales: {type: [Operario]}

})

module.exports = mongoose.model('MovimientoOperario', movimientoOperarioSchema)