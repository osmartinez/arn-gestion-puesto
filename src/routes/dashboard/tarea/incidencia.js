const express = require('express')
const configParams = require('../../../lib/config.params')
const Incidencia = require('../../../lib/model/incidencia.model')
const router = express.Router()

module.exports = function (router) {
    router.post('/tarea/incidencia/nueva', (req, res) => {
        const {incidencia} = req.body

        
    })
}