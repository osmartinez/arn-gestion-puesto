const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movimientoPulsoSchema = new mongoose.Schema({
    fechaMovimiento: {type:Date, default: Date.now},
    cantidad: {type: Number}
})

module.exports = mongoose.model('MovimientoPulso', movimientoPulsoSchema)