const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Puesto = require('./puesto.model').schema
const Tarea = require('./tarea.model').schema
const MovimientoOperario = require('./movimientoOperario.model').schema

const puestoTareasActualesSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    puesto: {type: Puesto},
    tareas: {type: [Tarea]},
    movimientosOperarios:{type: [MovimientoOperario]},
    fechaInicio:{type: Date, default: new Date()},
    fechaFin:{type: Date},
    terminado: {type:Boolean, default:false}
})

module.exports = mongoose.model('PuestoTareasActuales', puestoTareasActualesSchema)