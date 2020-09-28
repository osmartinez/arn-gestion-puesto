const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Operario = require('./operario.model').schema

const movimientoOperarioSchema = new mongoose.Schema({
    idPuestoSql: { type: Number },
    fechaEntrada: { type: Date, default: new Date() },
    fechaSalida: { type: Date, default: null },
    idOperarioSql: { type: Number },
    codigoOperarioSql: { type: String },
    nombre: { type: String },
    apellidos: {type:String},
},
    {
        toObject: {
            virtuals: true,
        },
        toJSON: {
            virtuals: true,
        },
    })

module.exports = mongoose.model('MovimientoOperario', movimientoOperarioSchema)