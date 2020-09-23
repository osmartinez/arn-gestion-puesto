const mongoose = require('mongoose')
const Schema = mongoose.Schema

const operarioSchema = new mongoose.Schema({
    idSql: {type: Number, required:true},
    codigoObrero: {type: String},
    codigoEtiqueta: {type: String},
    fechaEntrada: {type:String},
})

module.exports = mongoose.model('Operario', operarioSchema)