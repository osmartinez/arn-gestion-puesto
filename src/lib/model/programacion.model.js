const mongoose = require('mongoose')

const programacionSchema = new mongoose.Schema({
    idPuestoSql:{type: Number, required:true},
    idSql: {type: Number, required:true},
    fechaActualizacion: {type:Date,default: Date.now},
    cantidad: {type:Number},
    terminada: {type:Boolean, default:false},
})

module.exports = mongoose.model('Programacion', programacionSchema)