const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Maquina = require('./maquina.model').schema

const puestoSchema = new mongoose.Schema({
    idSql: {type: Number, required:true},
    descripcion: {type: String},
    observaciones: {type: String},
    maquinas: {type: [Maquina]}
})

module.exports = mongoose.model('Puesto', puestoSchema)