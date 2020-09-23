const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Puesto = require('./puesto.model')
const Tarea = require('./tarea.model')
const MovimientoOperario = require('./movimientoOperario.model')

const puestoTareasActualesSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    puesto: {type: Puesto},
    tareas: {type: [Tarea]},
    movimientosOperarios:{type: [MovimientoOperario]},
    fechaUltimaActualizacion:{type: Date},
})

module.exports = mongoose.model('PuestoTareasActuales', puestoTareasActualesSchema)