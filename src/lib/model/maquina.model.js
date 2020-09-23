const mongoose = require('mongoose')
const Schema = mongoose.Schema

const maquinaSchema = new mongoose.Schema({
    idSql: {type: Number, required:true},
    nombre: {type: String},
    codigoEtiqueta: {type: String},

})

module.exports = mongoose.model('Maquina', maquinaSchema)