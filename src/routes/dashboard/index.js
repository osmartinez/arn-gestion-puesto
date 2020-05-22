const express = require('express')
const router = express.Router()
const {buscarOrden,buscarOperacion } = require('../../lib/fetch')
const configParams = require('../../lib/config.params')

router.get('/',(req,res)=>{
    res.render('dashboard/index', {layout: 'main-dashboard'})
})

router.get('/task',(req,res)=>{
    res.render('dashboard/task',{layout: 'main-dashboard'})
})

router.get('/buscarOrden/:idOrden',async (req,res)=>{
    const {idOrden} = req.params
    var orden = await buscarOrden(idOrden)
    res.json(orden)
})

router.get('/buscarOperacion/:idOrden/:codSeccion',async (req,res)=>{
    const {idOrden,codSeccion} = req.params
    var operaciones = await buscarOperacion(idOrden,codSeccion)
    res.json(operaciones)
})

// settings
require('./settings')(router)
require('./operarios')(router)

module.exports = router