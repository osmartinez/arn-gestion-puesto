const mongoose = require('mongoose')
const MovimientoPulso = require('./movimientoPulso.model').schema
const Paquete = require('./paquete.model').schema
const DetalleTarea = require('./detalleTarea.model').schema

const tareaSchema = new mongoose.Schema({
    idPuestoSql:{type: Number, required:true},
    fechaInicio: {type:Date,default: Date.now},
    fechaFin:{type:Date, default: null},
    terminado: {type:Boolean, default:false},

    etiquetaFichada: {type:String},
    utillaje: {type: String},
    tallaUtillaje: {type: String},
    detallesTarea: {type: [DetalleTarea]},
    
    // generados por mi app
    cantidadFabricadaPuesto: {type: [MovimientoPulso]},
    cantidadDefectuosaPuesto: {type: [MovimientoPulso]},
    cantidadSaldosPuesto: {type: [MovimientoPulso]},
    paquetes: {type: [Paquete]}
})

module.exports = mongoose.model('Tarea', tareaSchema)