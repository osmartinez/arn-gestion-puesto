const express = require('express')
const configParams = require('../../lib/config.params')

const PuestoTareasActuales = require('../../lib/model/puestoTareasActuales.model')

const router = express.Router()

router.get('/',async (req,res)=>{

    try {
        puesto = configParams.read()
        if (puesto == null || !puesto.Id) {
            return  res.render('dashboard/index', {layout: 'main-dashboard'})
        }
        else {
            let puestoTareaActual = await PuestoTareasActuales.findOne({ "puesto.idSql": puesto.Id, terminado: false })
            if(puestoTareaActual==null){
               return  res.render('dashboard/index', {layout: 'main-dashboard'})
            }
            else{
               return res.redirect('/dashboard/tarea')
            }
        }
    } catch (err) {
        console.error(err)
        return  res.render('dashboard/index', {layout: 'main-dashboard'})
    }

})

// subrutas
require('./settings')(router)
require('./fichajes')(router)
require('./tarea')(router)
require('./averia')(router)
require('./incidencia-fichaje')(router)

module.exports = router