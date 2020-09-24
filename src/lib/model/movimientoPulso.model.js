const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movimientoPulsoSchema = new mongoose.Schema({
    fechaMovimiento: {type:Date, default: new Date()},
    cantidad: {type: Number}
})

module.exports = mongoose.model('MovimientoPulso', movimientoPulsoSchema)