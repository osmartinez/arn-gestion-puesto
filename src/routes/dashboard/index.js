const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('dashboard/index', {layout: 'main-dashboard'})
})

// subrutas
require('./settings')(router)
require('./operarios')(router)
require('./task')(router)
require('./averia')(router)

module.exports = router