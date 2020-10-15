const mongoose = require('mongoose')

const incidenciaSchema = new mongoose.Schema({
    idPuestoSql:{type: Number, required:true},
    idSql: {type: Number, required:true},
    fechaInicio: {type:Date,default: Date.now},
    fechaFin:{type:Date, default: null},
    avisarA: {type:String, default: 'NADIE'},
    corregible: {type:Boolean, default:false},
    nombre: {type:String},
    pinNotificacion1: {type:String},
    pinNotificacion2: {type:String},
    segundosEjecucion: {type:Number},
    mostrar:{type: Boolean,default:true},
    bloqueante:{type: Boolean,default:false}
})

module.exports = mongoose.model('Incidencia', incidenciaSchema)