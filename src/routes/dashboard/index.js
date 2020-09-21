const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('dashboard/index', {layout: 'main-dashboard'})
})

// subrutas
require('./settings')(router)
require('./fichajes')(router)
require('./tarea')(router)
require('./averia')(router)
require('./incidencia-fichaje')(router)

module.exports = router